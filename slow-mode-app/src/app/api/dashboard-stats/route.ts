import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const userId = user.userId;

    // Somme des commandes finalisées ou expédiées impliquant le pro
    const receivedStatuses = ["EXPEDIEE", "TERMINEE"];

    const whereForPro: any = {
      OR: [
        { couturierId: userId },
        { fournisseurId: userId },
      ],
      statut: { in: receivedStatuses },
    };

    const received = await prisma.commande.aggregate({
      _sum: { montant_total: true },
      where: whereForPro,
    });

    const countReceived = await prisma.commande.count({ where: whereForPro });

    // Pending (EN_ATTENTE, EN_COURS)
    const pending = await prisma.commande.aggregate({
      _sum: { montant_total: true },
      where: { OR: [{ couturierId: userId }, { fournisseurId: userId }], statut: { in: ["EN_ATTENTE", "EN_COURS", "EN_ATTENTE_VALIDATION"] } },
    });

    // Recent commandes (last 5)
    const recent = await prisma.commande.findMany({ where: { OR: [{ couturierId: userId }, { fournisseurId: userId }] }, orderBy: { date_commande: 'desc' }, take: 5 });

    return NextResponse.json({ success: true, stats: { total_received: received._sum.montant_total || 0, count_received: countReceived, total_pending: pending._sum.montant_total || 0, recent } });
  } catch (error) {
    console.error('Erreur dashboard-stats:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
