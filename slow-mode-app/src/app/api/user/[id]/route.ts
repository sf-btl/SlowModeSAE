import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // params is now a Promise in Next.js 15+ (if using recent version, standardizing on Promise access is safer)
) {
    // Await params because in newer Next.js versions params can be async
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
        return NextResponse.json(
            { success: false, message: "ID invalide" },
            { status: 400 }
        );
    }

    try {
        // 1. Fetch User Basic Info
        const user = await prisma.utilisateur.findUnique({
            where: { id: userId },
            select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    adresse_postale: true,
                    ville: true,
                    // On récupère aussi les tables liées si besoin
                    couturier: { select: { bio_description: true } },
                    fournisseur: { select: { nom_societe: true } },
                },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Utilisateur introuvable" },
                { status: 404 }
            );
        }

        // Determine Role
        let role = "acheteur"; // Default
        if (user.couturier) role = "couturier";
        if (user.fournisseur) role = "fournisseur";

        // 2. Fetch Posts
        let posts: any[] = [];
        if (role === "couturier") {
            posts = await prisma.post.findMany({
                where: { couturierId: userId },
                orderBy: { date_publication: "desc" },
                select: {
                    id: true,
                    photo_resultat: true,
                    produitId: true,
                    tissuId: true
                }
            });
        } else if (role === "fournisseur") {
            posts = await prisma.post.findMany({
                where: { fournisseurId: userId },
                orderBy: { date_publication: "desc" },
                select: {
                    id: true,
                    photo_resultat: true,
                    produitId: true,
                    tissuId: true
                }
            });
        }

        // 3. Format Response
        const data = {
            id: user.id,
            navn: role === 'fournisseur' && user.fournisseur?.nom_societe
                ? user.fournisseur.nom_societe
                : `${user.prenom} ${user.nom}`,
            role: role,
            description: user.couturier?.bio_description || "",
            adresse_postale: user.adresse_postale || null,
            ville: user.ville || null,
            posts: posts,
        };

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Erreur API User:", error);
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
