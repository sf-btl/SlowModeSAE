// /api/tissu/route.ts (Fichier COMPLET - Corrigé pour Photo Obligatoire)

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth"; // Assurez-vous que cet import est correct

// Chemin de stockage public pour les images de tissu
// NOTE: Nous utilisons un sous-dossier 'tissus' pour l'organisation
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "tissus");

export async function POST(req: Request) {

    // ------------------------------------------
    // 1. VÉRIFICATION DE LA SESSION ET DES DROITS
    // ------------------------------------------
    const userSession = await getCurrentUser();

    if (!userSession || userSession.accountType !== 'fournisseur') {
        // 401: Non authentifié, 403: Autorisation refusée (mauvais rôle)
        return NextResponse.json(
            { success: false, message: "Accès refusé. Seuls les comptes Fournisseur peuvent ajouter des tissus." },
            { status: userSession ? 403 : 401 }
        );
    }
    const fournisseurId = userSession.userId;

    // ------------------------------------------
    // 2. RÉCUPÉRATION DES DONNÉES DU FORMULAIRE
    // ------------------------------------------

    const formData = await req.formData();

    // Champs du schéma réel
    const couleur = formData.get("couleur") as string;
    const matiere = formData.get("matiere") as string;
    const grammage = Number(formData.get("grammage"));
    const metrage_dispo = Number(formData.get("metrage_dispo"));

    // Champ manquant dans votre schéma de table, mais essentiel pour la vente
    const prix_unitaire = Number(formData.get("prix_unitaire"));

    // Données pour le Post éventuel
    const createPost = formData.get("createPost") === "true";
    const titrePost = formData.get("titrePost") as string | null;
    const descriptionPost = formData.get("descriptionPost") as string | null;

    const imageFile = formData.get("image") as File | null;


    // Validation de base des champs
    if (!couleur || !matiere || isNaN(grammage) || isNaN(metrage_dispo) || isNaN(prix_unitaire)) {
        return NextResponse.json(
            { success: false, message: "Tous les champs texte et numériques requis doivent être remplis correctement." },
            { status: 400 }
        );
    }


    let imagePath: string | null = null; // Initialisé à null

    // ------------------------------------------
    // 3. Gestion et enregistrement du fichier image (OBLIGATOIRE)
    // ------------------------------------------

    if (!imageFile || imageFile.size === 0) {
        return NextResponse.json(
            { success: false, message: "La photo du tissu est obligatoire." },
            { status: 400 }
        );
    }

    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const extension = path.extname(imageFile.name);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${extension}`;
        const fullPath = path.join(UPLOAD_DIR, fileName);
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.writeFile(fullPath, buffer);
        imagePath = `/uploads/tissus/${fileName}`;
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'image de tissu:", error);
        // Si l'écriture échoue, on renvoie une erreur serveur et on arrête
        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de l'enregistrement de l'image." },
            { status: 500 }
        );
    }

    // 4. CRÉATION DU TISSU EN BASE DE DONNÉES

    try {
        // NOTE: À ce stade, imagePath est garanti d'être une string non nulle.
        const tissu = await prisma.tissu.create({
            data: {
                // Champs correspondant à la structure de votre table
                couleur: couleur,
                grammage: grammage,
                matiere: matiere,
                metrage_dispo: metrage_dispo,

                // Champs dérivés ou liés que vous devez avoir dans le modèle Prisma:
                prix_unitaire: prix_unitaire,
                imagePath: imagePath, // imagePath est maintenant garanti
                fournisseurId: fournisseurId,
            },
        });

        // 5. CRÉATION DU POST (OPTIONNEL)
        if (createPost && titrePost && descriptionPost) {
            await prisma.post.create({
                data: {
                    titre_creation: titrePost,
                    description: descriptionPost,
                    photo_resultat: imagePath,
                    // On lie au fournisseur connecté
                    fournisseurId: fournisseurId,
                    // couturierId reste null ou undefined
                    tissuId: tissu.id, // Linking the post to the fabric
                },
            });
        }

        return NextResponse.json({ success: true, tissuId: tissu.id });

    } catch (error) {
        console.error("Erreur Prisma (Tissu):", error);
        return new NextResponse("Erreur serveur lors de la sauvegarde des données du tissu.", { status: 500 });
    }
}

export async function GET() {
    try {
        const tissus = await prisma.tissu.findMany({
            include: {
                fournisseur: {
                    select: {
                        nom_societe: true,
                    },
                },
            },
            orderBy: {
                id: 'desc'
            }
        });

        // Add full url for image if needed, or just return as is (client handles it)
        return NextResponse.json({ success: true, tissus });
    } catch (error) {
        console.error("Erreur lors de la récupération des tissus:", error);
        return NextResponse.json(
            { success: false, message: "Erreur serveur lors de la récupération des tissus." },
            { status: 500 }
        );
    }
}