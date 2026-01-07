import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const body = await req.json().catch(() => ({} as any));
    const produitId = Number(body.produitId);
    const delta = Number(body.delta) || 0;

    if (Number.isNaN(produitId)) return NextResponse.json({ success: false, message: "Produit invalide" }, { status: 400 });

    const produit = await prisma.produit.findUnique({ where: { id: produitId } });
    if (!produit) return NextResponse.json({ success: false, message: "Produit introuvable" }, { status: 404 });

    // Vérification: seul le couturier propriétaire peut modifier son stock
    if (user.accountType !== "couturier" || produit.couturierId !== user.userId) {
      return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
    }

    const newStock = Math.max(0, produit.stock + delta);
    const updated = await prisma.produit.update({ where: { id: produitId }, data: { stock: newStock } });

    return NextResponse.json({ success: true, produit: { id: updated.id, stock: updated.stock } });
  } catch (error) {
    console.error("Erreur mise à jour stock:", error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
