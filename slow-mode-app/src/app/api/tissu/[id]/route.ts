import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);

        if (Number.isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "ID invalide" },
                { status: 400 }
            );
        }

        const tissu = await prisma.tissu.findUnique({
            where: { id },
            include: {
                fournisseur: {
                    include: {
                        utilisateur: {
                            select: {
                                nom: true,
                                prenom: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tissu) {
            return NextResponse.json(
                { success: false, message: "Tissu non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: tissu });
    } catch (error) {
        console.error("Erreur lors de la récupération du tissu:", error);
        return NextResponse.json(
            { success: false, message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
