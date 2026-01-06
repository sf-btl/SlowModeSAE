import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.produit.findMany({
      include: {
        couturier: {
          include: {
            utilisateur: {
              select: {
                nom: true,
                prenom: true,
                ville: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc' // Les plus récents en premier
      },
      take: 50 // Limite à 50 produits
    });

    return NextResponse.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors du chargement des produits'
      },
      { status: 500 }
    );
  }
}