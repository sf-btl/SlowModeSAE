import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken, setAuthCookie } from '@/lib/auth';
import { scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur par email
    const user = await prisma.utilisateur.findUnique({
      where: { email },
      include: {
        acheteur: true,
        couturier: true,
        fournisseur: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const [salt, storedHash] = user.mot_de_passe.split(':');
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
    const hash = derivedKey.toString('hex');

    if (hash !== storedHash) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Déterminer le type de compte
    let accountType = '';
    if (user.acheteur) accountType = 'acheteur';
    else if (user.couturier) accountType = 'couturier';
    else if (user.fournisseur) accountType = 'fournisseur';

    // Créer le token JWT (inclure adresse_postale et ville pour garder la localite)
    const token = await createToken({
      userId: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      accountType,
      adresse_postale: user.adresse_postale || null,
      ville: user.ville || null,
    });
  
    // Définir le cookie
    await setAuthCookie(token);

    // Connexion réussie
    console.log('Utilisateur connecté ID:', user.id, 'Type de compte:', accountType);
    
    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        accountType
      }
    })

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la connexion',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
