import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

  try {
    const couturier = await prisma.couturier.findUnique({ where: { utilisateurId: user.userId } });
    if (!couturier) return NextResponse.json({ success: false, message: "Compte couturier requis." }, { status: 403 });

    const hasDelegates = Boolean((prisma as any).couturierPrice && typeof (prisma as any).couturierPrice.findMany === 'function');

    if (hasDelegates) {
      const prices = await (prisma as any).couturierPrice.findMany({
        where: { couturierId: couturier.utilisateurId },
        orderBy: { id: 'desc' },
        select: { id: true, couturierId: true, typeProjet: true, categorie: true, prix: true },
      });
      return NextResponse.json({ success: true, prices });
    }

    // Fallback to raw query if delegates are not available at runtime
    const prices = await prisma.$queryRaw<any[]>`
      SELECT id, "couturierId", "typeProjet", categorie, prix
      FROM "CouturierPrice"
      WHERE "couturierId" = ${couturier.utilisateurId}
      ORDER BY id DESC
    `;
    return NextResponse.json({ success: true, prices });
  } catch (e: any) {
    console.error("GET /api/couturier/prices error:", e);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

  try {
    const body = await req.json();
    const { typeProjet, categorie, prix } = body as { typeProjet: string; categorie?: string | null; prix: number };

    if (!typeProjet || typeof prix !== "number") {
      return NextResponse.json({ success: false, message: "Données invalides" }, { status: 400 });
    }

    const couturier = await prisma.couturier.findUnique({ where: { utilisateurId: user.userId } });
    if (!couturier) return NextResponse.json({ success: false, message: "Compte couturier requis." }, { status: 403 });

    const hasDelegates = Boolean((prisma as any).couturierPrice && typeof (prisma as any).couturierPrice.findFirst === 'function');

    if (hasDelegates) {
      // If categorie is null => user clicked "Toutes". Apply price to all categories.
      if (categorie == null) {
        // update all existing prices for this couturier/type
        await (prisma as any).couturierPrice.updateMany({ where: { couturierId: couturier.utilisateurId, typeProjet }, data: { prix } });

        // ensure there is a NULL category row
        const nullRow = await (prisma as any).couturierPrice.findFirst({ where: { couturierId: couturier.utilisateurId, typeProjet, categorie: null } });
        if (!nullRow) {
          await (prisma as any).couturierPrice.create({ data: { couturierId: couturier.utilisateurId, typeProjet, categorie: null, prix } });
        }

        // Ensure common categories exist (creates missing entries)
        const categories = ['TOPS','BOTTOMS','FULL_BODY','OUTERWEAR','LINGERIE','ACCESSORIES'];
        for (const cat of categories) {
          const ex = await (prisma as any).couturierPrice.findFirst({ where: { couturierId: couturier.utilisateurId, typeProjet, categorie: cat } });
          if (!ex) {
            await (prisma as any).couturierPrice.create({ data: { couturierId: couturier.utilisateurId, typeProjet, categorie: cat, prix } });
          }
        }

        return NextResponse.json({ success: true });
      }

      const whereClause = { couturierId: couturier.utilisateurId, typeProjet, categorie };
      const existing = await (prisma as any).couturierPrice.findFirst({ where: whereClause });
      if (existing) {
        const updated = await (prisma as any).couturierPrice.update({ where: { id: existing.id }, data: { prix } });
        return NextResponse.json({ success: true, price: updated });
      } else {
        const created = await (prisma as any).couturierPrice.create({ data: {
          couturierId: couturier.utilisateurId,
          typeProjet,
          categorie: categorie ?? null,
          prix,
        } });
        return NextResponse.json({ success: true, price: created });
      }
    }

    // Fallback: no delegates available — use safe tagged-template raw queries
    const existingRaw = categorie == null
      ? await prisma.$queryRaw<any[]>`SELECT id FROM "CouturierPrice" WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${typeProjet} AND categorie IS NULL LIMIT 1`
      : await prisma.$queryRaw<any[]>`SELECT id FROM "CouturierPrice" WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${typeProjet} AND categorie = ${categorie} LIMIT 1`;

    if (existingRaw && existingRaw.length > 0) {
      const id = existingRaw[0].id;
      await prisma.$executeRaw`UPDATE "CouturierPrice" SET prix = ${prix} WHERE id = ${id}`;
      const updated = await prisma.$queryRaw<any[]>`SELECT id, "couturierId", "typeProjet", categorie, prix FROM "CouturierPrice" WHERE id = ${id}`;
      return NextResponse.json({ success: true, price: updated[0] });
    }

    if (categorie == null) {
      // Apply to all existing rows for this typeProjet
      await prisma.$executeRaw`UPDATE "CouturierPrice" SET prix = ${prix} WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${typeProjet}`;

      // Ensure NULL category row exists
      const nullRow = await prisma.$queryRaw<any[]>`SELECT id FROM "CouturierPrice" WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${typeProjet} AND categorie IS NULL LIMIT 1`;
      if (!nullRow || nullRow.length === 0) {
        await prisma.$executeRaw`INSERT INTO "CouturierPrice" ("couturierId","typeProjet",categorie,prix) VALUES (${couturier.utilisateurId},${typeProjet},NULL,${prix})`;
      }

      // Ensure common categories exist
      const categories = ['TOPS','BOTTOMS','FULL_BODY','OUTERWEAR','LINGERIE','ACCESSORIES'];
      for (const cat of categories) {
        const ex = await prisma.$queryRaw<any[]>`SELECT id FROM "CouturierPrice" WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${typeProjet} AND categorie = ${cat} LIMIT 1`;
        if (!ex || ex.length === 0) {
          await prisma.$executeRaw`INSERT INTO "CouturierPrice" ("couturierId","typeProjet",categorie,prix) VALUES (${couturier.utilisateurId},${typeProjet},${cat},${prix})`;
        }
      }

      return NextResponse.json({ success: true });
    }

    // Insert for specific category
    await prisma.$executeRaw`INSERT INTO "CouturierPrice" ("couturierId","typeProjet",categorie,prix) VALUES (${couturier.utilisateurId},${typeProjet},${categorie},${prix})`;
    const inserted = await prisma.$queryRaw<any[]>`SELECT id, "couturierId", "typeProjet", categorie, prix FROM "CouturierPrice" WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${typeProjet} AND categorie = ${categorie} ORDER BY id DESC LIMIT 1`;
    return NextResponse.json({ success: true, price: inserted[0] });
  } catch (e: any) {
    console.error("POST /api/couturier/prices error:", e);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

function categoriaIsNull(c: string | null | undefined) {
  // helper for tagged template; returns SQL boolean expression
  if (!c) return PrismaBoolean(`categoria IS NULL`);
  return PrismaBoolean(`categoria = ${c}`);
}

function categoriaInsertClause(c: string | null | undefined) {
  if (!c) {
    return { sql: `INSERT INTO "CouturierPrice" ("couturierId","typeProjet",categorie,prix) VALUES ($1,$2,NULL,$3)`, params: [/* couturierId, typeProjet, prix */] };
  }
  return { sql: `INSERT INTO "CouturierPrice" ("couturierId","typeProjet",categorie,prix) VALUES ($1,$2,$3,$4)`, params: [] };
}

// Minimal helpers to satisfy template typing — they are placeholders used when building raw templates above.
function PrismaBoolean(s: string): any {
  return prisma as any; // no-op placeholder to keep typings; actual SQL injected above via template
}
