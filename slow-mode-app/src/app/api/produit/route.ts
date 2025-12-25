// /api/produit/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
// Importez vos utilitaires de session
import { getCurrentUser } from "@/lib/auth";

// Chemin de stockage public (où les images seront accessibles via /uploads/...)
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {

    // ------------------------------------------
    // 1. VÉRIFICATION DE LA SESSION ET DES DROITS
    // ------------------------------------------
    const userSession = await getCurrentUser();

    if (!userSession) {
        // Utilisateur non connecté
        return NextResponse.json(
            { success: false, message: "Authentification requise." },
            { status: 401 }
        );
    }

    const { userId, accountType } = userSession;

    // Connexion réussie
    console.log('Utilisateur connecté ID:', userId, 'Type de compte:', accountType);

    // RÈGLE D'AUTORISATION : Seuls les 'couturier' (ou 'admin' si vous en avez) peuvent créer un produit.
    // L'ID du créateur est l'ID de l'utilisateur.
    if (accountType !== 'couturier') {
        // Si vous voulez autoriser les 'admin' : || accountType !== 'admin'
        return NextResponse.json(
            { success: false, message: "Accès refusé. Seuls les comptes Couturier peuvent ajouter des produits." },
            { status: 403 } // 403 Forbidden
        );
    }

    // Nous avons l'ID du couturier connecté
    const couturierId = userId;

    // ------------------------------------------
    // 2. RÉCUPÉRATION DES DONNÉES ET GESTION D'IMAGE
    // ------------------------------------------

    const formData = await req.formData();

    const nom = formData.get("nom") as string;
    const description = formData.get("description") as string;
    const prix = Number(formData.get("prix"));
    const stock = Number(formData.get("stock"));
    const createPost = formData.get("createPost") === "true";
    const titrePost = formData.get("titrePost") as string | null;
    const descriptionPost = formData.get("descriptionPost") as string | null;
    const imageFile = formData.get("image") as File | null;


    let imagePath: string | null = null;

    // Gestion et enregistrement du fichier image (s'il existe)
    if (imageFile && imageFile.size > 0) {
        try {
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
            const extension = path.extname(imageFile.name);
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${extension}`;
            const fullPath = path.join(UPLOAD_DIR, fileName);
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await fs.writeFile(fullPath, buffer);
            imagePath = `/uploads/${fileName}`;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'image:", error);
            imagePath = null;
        }
    }

    // ------------------------------------------
    // 3. CRÉATION EN BASE DE DONNÉES
    // ------------------------------------------

    try {
        const produit = await prisma.produit.create({
            data: {
                nom_produit: nom,
                description,
                prix_unitaire: prix,
                stock,
                couturierId,
                imagePath: imagePath,
            },
        });

        // Création du Post (si la case est cochée)
        if (createPost && titrePost && descriptionPost) {
            await prisma.post.create({
                data: {
                    titre_creation: titrePost,
                    description: descriptionPost,
                    couturierId,
                    photo_resultat: imagePath,
                    produitId: produit.id, // Linking the post to the product
                },
            });
        }

        return NextResponse.json({ success: true, produitId: produit.id });

    } catch (error) {
        console.error("Erreur Prisma (Produit/Post):", error);
        return new NextResponse("Erreur serveur lors de la sauvegarde des données.", { status: 500 });
    }
}