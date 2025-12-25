import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TissuDetailClient, { type TissuDetailViewModel } from "./TissuDetailClient";

export const dynamic = "force-dynamic";

type PageParams = {
    params: {
        id: string;
    };
};

async function getTissuById(id: number) {
    return prisma.tissu.findUnique({
        where: { id },
        include: {
            fournisseur: {
                include: {
                    utilisateur: true,
                },
            },
        },
    });
}

export default async function TissuDetailPage({ params }: PageParams) {
    const tissuId = Number((await params).id);

    if (Number.isNaN(tissuId)) {
        notFound();
    }

    const tissu = await getTissuById(tissuId);

    if (!tissu) {
        notFound();
    }

    const fournisseur = tissu.fournisseur?.utilisateur;

    // Construction du nom du fournisseur (Société ou Nom/Prénom)
    const fournisseurName = tissu.fournisseur.nom_societe
        || `${fournisseur?.prenom || ""} ${fournisseur?.nom || ""}`.trim()
        || "Fournisseur inconnu";

    const tissuPayload: TissuDetailViewModel = {
        id: tissu.id,
        matiere: tissu.matiere,
        couleur: tissu.couleur,
        grammage: tissu.grammage,
        price: tissu.prix_unitaire,
        imagePath: tissu.imagePath,
        metrage_dispo: tissu.metrage_dispo,
        fournisseurName: fournisseurName,
    };

    return <TissuDetailClient tissu={tissuPayload} />;
}
