import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


function formatCommandeId(id: number) {
  return `CMD-${String(id).padStart(3, "0")}`;
}

function mapProgress(statut: string) {
  const map: Record<string, number> = {
    EN_ATTENTE_VALIDATION: 15,
    EN_ATTENTE: 25,
    EN_COURS: 55,
    EXPEDIEE: 80,
    TERMINEE: 100,
  };
  return map[statut] ?? 35;
}

function formatStatusLabel(statut: string) {
  return statut.replace(/_/g, " ");
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
  }

  // Pour les professionnels, on retourne les commandes où il est impliqué
  let where: any = {};
  if (user.accountType === "couturier") {
    where = { couturierId: user.userId };
  } else if (user.accountType === "fournisseur") {
    where = { fournisseurId: user.userId };
  } else {
    // Par défaut, acheteur
    where = { acheteurId: user.userId };
  }

  const commandes = await prisma.commande.findMany({
    where,
    orderBy: { date_commande: "desc" },
    include: {
      acheteur: { include: { utilisateur: true } },
    },
  });

  const payload = commandes.map((commande) => ({
    id: commande.id,
    code: formatCommandeId(commande.id),
    statut: formatStatusLabel(commande.statut),
    type: commande.type,
    progress: mapProgress(commande.statut),
    montant_total: commande.montant_total,
    date_commande: commande.date_commande,
    acheteur: commande.acheteur
      ? {
          utilisateur: commande.acheteur.utilisateur
            ? {
                nom: commande.acheteur.utilisateur.nom,
                prenom: commande.acheteur.utilisateur.prenom,
                email: commande.acheteur.utilisateur.email,
              }
            : null,
        }
      : null,
  }));

  return NextResponse.json({ success: true, commandes: payload });
}
