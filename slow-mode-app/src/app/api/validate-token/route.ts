import { NextRequest, NextResponse } from 'next/server'
import { validateResetToken } from '@/lib/token-validation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    const validation = validateResetToken(token)

    if (!validation.valid) {
      return NextResponse.json(
        { valid: false, error: validation.error },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    return NextResponse.json(
      { valid: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}