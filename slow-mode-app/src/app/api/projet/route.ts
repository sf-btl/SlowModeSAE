import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type ProjetPayload = {
  mode: "creation" | "retouche";
  categorie: "tops" | "bottoms" | "full-body" | "outerwear" | "lingerie" | "accessories";
  couturierId: number;
  tissuId?: number | null;
  description?: string;
  images?: string[];
  mensurations: Record<string, string>;
};

function mapCategorie(input: ProjetPayload["categorie"]) {
  const mapping = {
    tops: "TOPS",
    bottoms: "BOTTOMS",
    "full-body": "FULL_BODY",
    outerwear: "OUTERWEAR",
    lingerie: "LINGERIE",
    accessories: "ACCESSORIES",
  } as const;
  return mapping[input];
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as ProjetPayload;

    if (!body.couturierId || !body.categorie || !body.mode || !body.mensurations) {
      return NextResponse.json(
        { success: false, message: "Données manquantes." },
        { status: 400 }
      );
    }

    const mappedCategorie = mapCategorie(body.categorie);
    if (!mappedCategorie) {
      return NextResponse.json(
        { success: false, message: "Catégorie invalide." },
        { status: 400 }
      );
    }

    if (body.mode !== "creation" && body.mode !== "retouche") {
      return NextResponse.json(
        { success: false, message: "Type de projet invalide." },
        { status: 400 }
      );
    }

    const acheteur = await prisma.acheteur.findUnique({
      where: { utilisateurId: user.userId },
      include: { utilisateur: true },
    });

    if (!acheteur) {
      return NextResponse.json({ success: false, message: "Compte acheteur requis." }, { status: 403 });
    }

    const couturier = await prisma.couturier.findUnique({
      where: { utilisateurId: body.couturierId },
    });

    if (!couturier) {
      return NextResponse.json({ success: false, message: "Couturier introuvable." }, { status: 404 });
    }

    const adresse = acheteur.utilisateur.adresse_postale || "Non renseignée";
    // Déterminer le prix de base depuis CouturierPrice
    let montantTotal = 0;
    try {
      const typeProjetValue = body.mode === "creation" ? "CREATION" : "RETOUCHE";
      const hasDelegates = Boolean((prisma as any).couturierPrice && typeof (prisma as any).couturierPrice.findFirst === "function");
      if (hasDelegates) {
        let priceRow = await (prisma as any).couturierPrice.findFirst({
          where: { couturierId: couturier.utilisateurId, typeProjet: typeProjetValue, categorie: mappedCategorie },
        });
        if (!priceRow) {
          // fallback to NULL category (appliqué à "toutes")
          priceRow = await (prisma as any).couturierPrice.findFirst({
            where: { couturierId: couturier.utilisateurId, typeProjet: typeProjetValue, categorie: null },
          });
        }
        if (priceRow) montantTotal = Number(priceRow.prix) || 0;
      } else {
        // Raw query fallback
        const rows = await prisma.$queryRaw<any[]>`
          SELECT prix FROM "CouturierPrice" WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${body.mode === "creation" ? "CREATION" : "RETOUCHE"} AND categorie = ${mappedCategorie} LIMIT 1
        `;
        if (rows && rows.length > 0) {
          montantTotal = Number(rows[0].prix) || 0;
        } else {
          const rows2 = await prisma.$queryRaw<any[]>`
            SELECT prix FROM "CouturierPrice" WHERE "couturierId" = ${couturier.utilisateurId} AND "typeProjet" = ${body.mode === "creation" ? "CREATION" : "RETOUCHE"} AND categorie IS NULL LIMIT 1
          `;
          if (rows2 && rows2.length > 0) montantTotal = Number(rows2[0].prix) || 0;
        }
      }

      // Le prix du tissu n'est PAS ajouté au montant du couturier ici.
      // Le tissu fera l'objet d'une commande fournisseur distincte plus bas.
    } catch (e) {
      console.error("Erreur calcul prix projet:", e);
      // On laisse montantTotal = 0 en cas d'erreur, la commande sera créée et pourra être mise à jour par la suite
    }

    // Créer commande(s) dans une transaction :
    // - commandeCouturier : contient le projet et le montant correspondant au prix du couturier (hors tissu)
    // - commandeFournisseur (optionnelle) : pour acheter le tissu au fournisseur (ligne + décrément metrage)
    const result = await prisma.$transaction(async (tx) => {
      // 1) commande pour le couturier (prix hors tissu)
      const commandeCouturier = await tx.commande.create({
        data: {
          acheteurId: acheteur.utilisateurId,
          couturierId: body.couturierId,
          statut: "EN_ATTENTE_VALIDATION",
          adresse_livraison: adresse,
          montant_total: montantTotal,
          type: "PROJET",
          projet: {
            create: {
              typeProjet: body.mode === "creation" ? "CREATION" : "RETOUCHE",
              categorie: mappedCategorie,
              tissuId: body.tissuId ?? null,
              description: body.description ?? "",
              images: body.images ?? [],
              mensurations: body.mensurations,
            },
          },
        },
      });

      let commandeFournisseur: any = null;
      if (body.tissuId) {
        const tissu = await tx.tissu.findUnique({ where: { id: body.tissuId } });
        if (tissu) {
          // créer commande pour le fournisseur
          commandeFournisseur = await tx.commande.create({
            data: {
              acheteurId: acheteur.utilisateurId,
              fournisseurId: tissu.fournisseurId,
              statut: "EN_ATTENTE",
              adresse_livraison: adresse,
              montant_total: Number(tissu.prix_unitaire) || 0,
              type: "PRODUIT",
            },
          });

          // créer ligne de commande pour le tissu (quantite = 1 par défaut pour la sous-commande)
          await tx.ligneCommande.create({
            data: {
              commandeId: commandeFournisseur.id,
              tissuId: tissu.id,
              quantite: 1,
              prix_unitaire: Number(tissu.prix_unitaire) || 0,
            },
          });

          // décrémenter le metrage_dispo (décrementation de 1 par défaut)
          await tx.tissu.update({ where: { id: tissu.id }, data: { metrage_dispo: { decrement: 1 } } });
        }
      }

      return { commandeCouturierId: commandeCouturier.id, commandeFournisseurId: commandeFournisseur?.id ?? null };
    });

    return NextResponse.json({ success: true, commandeCouturierId: result.commandeCouturierId, commandeFournisseurId: result.commandeFournisseurId });
  } catch (error: any) {
    console.error("Création projet erreur:", error);
    const message =
      process.env.NODE_ENV === "development"
        ? error?.message || "Erreur serveur."
        : "Erreur serveur.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
