import { NextRequest, NextResponse } from 'next/server'
import { validateResetToken } from '@/lib/token-validation'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    // Validation des données
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Validation du token avec l'utilitaire centralisé
    console.log('Validation du token:', token)
    console.log('Nouveau mot de passe:', password)

    const validation = validateResetToken(token)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Ici vous feriez:
    // 1. Récupérer l'utilisateur associé au token
    // 2. Hasher le nouveau mot de passe
    // 3. Mettre à jour en base de données
    // 4. Supprimer/invalider le token utilisé

    // Simulation d'une réinitialisation réussie
    return NextResponse.json(
      { 
        message: 'Mot de passe réinitialisé avec succès',
        success: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}