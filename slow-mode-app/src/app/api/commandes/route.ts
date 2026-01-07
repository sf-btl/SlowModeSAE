import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


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

  const commandes = await prisma.commande.findMany({
    where: { acheteurId: user.userId },
    orderBy: { date_commande: "desc" },
  });

  const payload = commandes.map((commande) => ({
    id: commande.id,
    code: formatCommandeId(commande.id),
    statut: formatStatusLabel(commande.statut),
    type: commande.type,
    progress: mapProgress(commande.statut),
  }));

  return NextResponse.json({ success: true, commandes: payload });
}
