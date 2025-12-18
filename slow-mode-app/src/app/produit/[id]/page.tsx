import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient, { type ProductDetailViewModel } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

type PageParams = {
  params: {
    id: string;
  };
};

async function getProductById(id: number) {
  return prisma.produit.findUnique({
    where: { id },
    include: {
      couturier: {
        include: {
          utilisateur: true,
        },
      },
    },
  });
}

export default async function ProductDetailPage({ params }: PageParams) {
  const productId = Number((await params).id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  const couturier = product.couturier?.utilisateur;
  const productPayload: ProductDetailViewModel = {
    id: product.id,
    name: product.nom_produit,
    description: product.description ?? "",
    price: product.prix_unitaire,
    imagePath: product.imagePath ?? null,
    stock: product.stock,
    couturierName: couturier ? `${couturier.prenom} ${couturier.nom}`.trim() : "Créateur inconnu",
    addedAt: null,
  };

  return <ProductDetailClient product={productPayload} />;
}
