import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { couturierId: user.userId },
                { fournisseurId: user.userId },
            ],
        },
        orderBy: {
            date_publication: "desc",
        },
        select: {
            id: true,
            photo_resultat: true,
        },
    });

    return NextResponse.json({ success: true, data: posts });
}
