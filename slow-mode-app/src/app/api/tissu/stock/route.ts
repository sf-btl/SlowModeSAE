import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const body = await req.json().catch(() => ({} as any));
    const tissuId = Number(body.tissuId);
    const delta = Number(body.delta) || 0;

    if (Number.isNaN(tissuId)) return NextResponse.json({ success: false, message: "Tissu invalide" }, { status: 400 });

    const tissu = await prisma.tissu.findUnique({ where: { id: tissuId } });
    if (!tissu) return NextResponse.json({ success: false, message: "Tissu introuvable" }, { status: 404 });

    if (user.accountType !== "fournisseur" || tissu.fournisseurId !== user.userId) {
      return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
    }

    const newMetrage = Math.max(0, tissu.metrage_dispo + delta);
    const updated = await prisma.tissu.update({ where: { id: tissuId }, data: { metrage_dispo: newMetrage } });

    return NextResponse.json({ success: true, tissu: { id: updated.id, metrage_dispo: updated.metrage_dispo } });
  } catch (error) {
    console.error("Erreur mise à jour metrage:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
