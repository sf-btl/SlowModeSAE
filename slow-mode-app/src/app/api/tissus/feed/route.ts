import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tissus = await prisma.tissu.findMany({
      include: {
        fournisseur: {
          select: {
            nom_societe: true,
            utilisateur: {
              select: {
                nom: true,
                prenom: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      },
      take: 50
    });

    return NextResponse.json({
      success: true,
      tissus
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tissus:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors du chargement des tissus'
      },
      { status: 500 }
    );
  }
}