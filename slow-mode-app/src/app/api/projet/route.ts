import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type ProjetPayload = {
  mode: "creation" | "retouche";
  categorie: "tops" | "bottoms" | "full-body" | "outerwear" | "lingerie" | "accessories";
  couturierId: number;
  tissuId?: number | null;
  description?: string;
  images?: string[];
  mensurations: Record<string, string>;
};

function mapCategorie(input: ProjetPayload["categorie"]) {
  const mapping = {
    tops: "TOPS",
    bottoms: "BOTTOMS",
    "full-body": "FULL_BODY",
    outerwear: "OUTERWEAR",
    lingerie: "LINGERIE",
    accessories: "ACCESSORIES",
  } as const;
  return mapping[input];
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as ProjetPayload;

    if (!body.couturierId || !body.categorie || !body.mode || !body.mensurations) {
      return NextResponse.json(
        { success: false, message: "Données manquantes." },
        { status: 400 }
      );
    }

    const mappedCategorie = mapCategorie(body.categorie);
    if (!mappedCategorie) {
      return NextResponse.json(
        { success: false, message: "Catégorie invalide." },
        { status: 400 }
      );
    }

    if (body.mode !== "creation" && body.mode !== "retouche") {
      return NextResponse.json(
        { success: false, message: "Type de projet invalide." },
        { status: 400 }
      );
    }

    const acheteur = await prisma.acheteur.findUnique({
      where: { utilisateurId: user.userId },
      include: { utilisateur: true },
    });

    if (!acheteur) {
      return NextResponse.json({ success: false, message: "Compte acheteur requis." }, { status: 403 });
    }

    const couturier = await prisma.couturier.findUnique({
      where: { utilisateurId: body.couturierId },
    });

    if (!couturier) {
      return NextResponse.json({ success: false, message: "Couturier introuvable." }, { status: 404 });
    }

    const adresse = acheteur.utilisateur.adresse_postale || "Non renseignée";

    const commande = await prisma.commande.create({
      data: {
        acheteurId: acheteur.utilisateurId,
        couturierId: body.couturierId,
        statut: "EN_ATTENTE_VALIDATION",
        adresse_livraison: adresse,
        montant_total: 0,
        type: "PROJET",
        projet: {
          create: {
            typeProjet: body.mode === "creation" ? "CREATION" : "RETOUCHE",
            categorie: mappedCategorie,
            tissuId: body.tissuId ?? null,
            description: body.description ?? "",
            images: body.images ?? [],
            mensurations: body.mensurations,
          },
        },
      },
    });

    return NextResponse.json({ success: true, commandeId: commande.id });
  } catch (error: any) {
    console.error("Création projet erreur:", error);
    const message =
      process.env.NODE_ENV === "development"
        ? error?.message || "Erreur serveur."
        : "Erreur serveur.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
