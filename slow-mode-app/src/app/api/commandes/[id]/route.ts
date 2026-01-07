import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function formatCommandeId(id: number) {
  return `CMD-${String(id).padStart(3, "0")}`;
}

function formatStatusLabel(statut: string) {
  return statut.replace(/_/g, " ");
}

export async function GET(
  req: Request,
  { params }: { params?: { id?: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Non authentifie" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const pathId = url.pathname.split("/").filter(Boolean).pop() ?? "";
    const rawId = params?.id ?? pathId;
    const normalized = rawId.startsWith("CMD-")
      ? rawId.replace("CMD-", "")
      : rawId;
    const commandeId = Number(normalized);
    if (Number.isNaN(commandeId)) {
      return NextResponse.json(
        { success: false, message: "Identifiant invalide." },
        { status: 400 }
      );
    }

    const commande = await prisma.commande.findUnique({
      where: { id: commandeId },
      include: {
        projet: {
          include: {
            tissu: true,
          },
        },
        lignes: {
          include: {
            produit: true,
            tissu: true,
          },
        },
        couturier: {
          include: { utilisateur: true },
        },
      },
    });

    if (!commande) {
      if (process.env.NODE_ENV === "development") {
        const ids = await prisma.commande.findMany({
          select: { id: true, acheteurId: true, couturierId: true, fournisseurId: true },
        });
        return NextResponse.json(
          {
            success: false,
            message: "Commande introuvable.",
            debug: { requested: commandeId, userId: user.userId, ids },
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Commande introuvable." },
        { status: 404 }
      );
    }

    const canAccess =
      commande.acheteurId === user.userId ||
      commande.couturierId === user.userId ||
      commande.fournisseurId === user.userId;
    if (!canAccess) {
      return NextResponse.json(
        { success: false, message: "Accès refusé." },
        { status: 403 }
      );
    }

    const couturierName = commande.couturier
      ? `${commande.couturier.utilisateur.prenom} ${commande.couturier.utilisateur.nom}`.trim()
      : null;

    return NextResponse.json({
      success: true,
      commande: {
        id: commande.id,
        code: formatCommandeId(commande.id),
        statut: formatStatusLabel(commande.statut),
        type: commande.type,
        date: commande.date_commande,
        montant_total: commande.montant_total,
        couturierName,
        projet: commande.projet
          ? {
              typeProjet: commande.projet.typeProjet,
              categorie: commande.projet.categorie,
              tissu: commande.projet.tissu
                ? `${commande.projet.tissu.matiere} ${commande.projet.tissu.couleur}`
                : null,
              description: commande.projet.description,
              images: commande.projet.images,
              mensurations: commande.projet.mensurations,
            }
          : null,
        lignes: commande.lignes.map((ligne) => ({
          id: ligne.id,
          quantite: ligne.quantite,
          prix_unitaire: ligne.prix_unitaire,
          produit: ligne.produit?.nom_produit ?? null,
          tissu: ligne.tissu
            ? `${ligne.tissu.matiere} ${ligne.tissu.couleur}`
            : null,
        })),
      },
    });
  } catch (error: any) {
    console.error("Commande detail erreur:", error);
    const message =
      process.env.NODE_ENV === "development"
        ? error?.message || "Erreur serveur."
        : "Erreur serveur.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
