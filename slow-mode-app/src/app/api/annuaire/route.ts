import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const couturiers = await prisma.couturier.findMany({
      include: { utilisateur: true },
      orderBy: { utilisateur: { createdAt: "desc" } },
    });

    const fournisseurs = await prisma.fournisseur.findMany({
      include: { utilisateur: true },
      orderBy: { utilisateur: { createdAt: "desc" } },
    });

    const entries = [
      ...couturiers.map((couturier) => ({
        id: `couturier-${couturier.utilisateurId}`,
        name: `${couturier.utilisateur.prenom} ${couturier.utilisateur.nom}`.trim(),
        role: "Créateur" as const,
        rating: couturier.note_moyenne ?? 0,
        locationHint:
          couturier.utilisateur.adresse_postale ??
          couturier.utilisateur.ville ??
          undefined,
      })),
      ...fournisseurs.map((fournisseur) => ({
        id: `fournisseur-${fournisseur.utilisateurId}`,
        name:
          fournisseur.nom_societe ||
          `${fournisseur.utilisateur.prenom} ${fournisseur.utilisateur.nom}`.trim(),
        role: "Fournisseur" as const,
        rating: fournisseur.note_moyenne ?? 0,
        locationHint:
          fournisseur.utilisateur.adresse_postale ??
          fournisseur.utilisateur.ville ??
          undefined,
      })),
    ];

    return NextResponse.json({
      entries,
      meta: { couturiers: couturiers.length, fournisseurs: fournisseurs.length },
    });
  } catch (error) {
    console.error("Erreur annuaire:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du chargement de l'annuaire." },
      { status: 500 }
    );
  }
}
