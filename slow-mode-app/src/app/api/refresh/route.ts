import { NextResponse } from 'next/server';
import { getCurrentUser, createToken, setAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Créer un nouveau token avec les mêmes données
    const newToken = await createToken({
      userId: user.userId,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      accountType: user.accountType
    });

    // Mettre à jour le cookie
    await setAuthCookie(newToken);

    return NextResponse.json({
      success: true,
      message: 'Token renouvelé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du refresh du token:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors du refresh du token',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
