import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { createToken, setAuthCookie } from '@/lib/auth';

const scryptAsync = promisify(scrypt);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      accountType,
      department,
      firstName,
      lastName,
      companyName,
      siret,
      email,
      password,
      phoneNumber,
      countryCode
    } = body;

    // Validation des champs requis de base
    if (!accountType || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Type de compte, email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Validation spécifique selon le type de compte
    if (accountType === 'entreprise') {
      if (!companyName || !siret) {
        return NextResponse.json(
          { success: false, message: 'Nom de société et SIRET requis pour un compte entreprise' },
          { status: 400 }
        );
      }
    } else {
      if (!firstName || !lastName) {
        return NextResponse.json(
          { success: false, message: 'Prénom et nom requis' },
          { status: 400 }
        );
      }
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe avec crypto.scrypt
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
    const hashedPassword = `${salt}:${derivedKey.toString('hex')}`;

    // Créer l'utilisateur selon le type de compte
    if (accountType === 'entreprise') {
      // Vérifier si le SIRET existe déjà
      const existingSiret = await prisma.fournisseur.findUnique({
        where: { siret }
      });

      if (existingSiret) {
        return NextResponse.json(
          { success: false, message: 'Ce numéro SIRET est déjà enregistré' },
          { status: 409 }
        );
      }

      const user = await prisma.utilisateur.create({
        data: {
          email,
          mot_de_passe: hashedPassword,
          nom: companyName || '',
          prenom: '',
          ville: department || null,
          adresse_postale: department || null,
          fournisseur: {
            create: {
              siret: siret!,
              nom_societe: companyName!,
            }
          }
        },
        include: {
          fournisseur: true
        }
      });

      // Créer le token JWT et le cookie
      const token = await createToken({
        userId: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        accountType: 'fournisseur'
      });

      await setAuthCookie(token);

      return NextResponse.json({
        success: true,
        message: 'Compte fournisseur créé avec succès',
        data: {
          id: user.id,
          email: user.email,
          accountType: 'fournisseur'
        }
      });

    } else {
      // Créer utilisateur de base
      const userData = {
        email,
        mot_de_passe: hashedPassword,
        nom: lastName || '',
        prenom: firstName || '',
        ville: department || null,
        adresse_postale: department || null,
      };

      if (accountType === 'particulier') {
        // Créer utilisateur + acheteur
        const user = await prisma.utilisateur.create({
          data: {
            ...userData,
            acheteur: {
              create: {}
            }
          },
          include: {
            acheteur: true
          }
        });

        // Créer le token JWT et le cookie
        const token = await createToken({
          userId: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          accountType: 'acheteur'
        });

        await setAuthCookie(token);

        return NextResponse.json({
          success: true,
          message: 'Compte acheteur créé avec succès',
          data: {
            id: user.id,
            email: user.email,
            accountType: 'acheteur'
          }
        });

      } else if (accountType === 'professionnel') {
        // Créer utilisateur + couturier
        const user = await prisma.utilisateur.create({
          data: {
            ...userData,
            couturier: {
              create: {}
            }
          },
          include: {
            couturier: true
          }
        });

        // Créer le token JWT et le cookie
        const token = await createToken({
          userId: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          accountType: 'couturier'
        });

        await setAuthCookie(token);

        return NextResponse.json({
          success: true,
          message: 'Compte créateur créé avec succès',
          data: {
            id: user.id,
            email: user.email,
            accountType: 'couturier'
          }
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'Type de compte invalide' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la création du compte',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
