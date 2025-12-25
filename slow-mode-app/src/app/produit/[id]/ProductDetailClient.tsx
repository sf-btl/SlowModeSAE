"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export type ProductDetailViewModel = {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string | null;
  stock: number;
  couturierName: string;
  addedAt?: string | null;
};

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

function deriveCategory(text: string): string {
  const normalized = text.toLowerCase();
  if (normalized.includes("chemise")) return "Chemises";
  if (normalized.includes("robe")) return "Robes";
  if (normalized.includes("pantalon")) return "Pantalons";
  if (normalized.includes("manteau") || normalized.includes("veste")) return "Vestes";
  return "Créations";
}

function deriveColor(name: string, description: string): string {
  const normalized = `${name} ${description}`.toLowerCase();
  if (normalized.includes("gris")) return "Gris";
  if (normalized.includes("noir")) return "Noir";
  if (normalized.includes("blanc")) return "Blanc";
  if (normalized.includes("bleu")) return "Bleu";
  if (normalized.includes("vert")) return "Vert";
  if (normalized.includes("rouge")) return "Rouge";
  if (normalized.includes("beige")) return "Beige";
  return "Non renseignée";
}

function formatPriceEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatRelativeTime(isoDate?: string | null): string {
  if (!isoDate) return "Récemment";
  const target = new Date(isoDate).getTime();
  const diffMs = Date.now() - target;
  if (Number.isNaN(diffMs)) return "Récemment";

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;

  const weeks = Math.floor(days / 7);
  return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
}

export default function ProductDetailClient({ product }: { product: ProductDetailViewModel }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [expanded, setExpanded] = useState(false);

  const priceLabel = useMemo(() => formatPriceEUR(product.price), [product.price]);
  const categoryLabel = useMemo(() => deriveCategory(product.name), [product.name]);
  const colorLabel = useMemo(() => deriveColor(product.name, product.description), [product.name, product.description]);
  const addedAgoLabel = useMemo(() => formatRelativeTime(product.addedAt), [product.addedAt]);

  const shortDescription = useMemo(() => {
    if (!product.description) return "Aucune description disponible pour ce produit.";
    if (product.description.length <= 160) return product.description;
    return `${product.description.slice(0, 160).trim()}...`;
  }, [product.description]);

  const showToggle = product.description && product.description.length > 160;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full p-2 text-gray-800 transition hover:bg-gray-100"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-gray-800 transition hover:bg-gray-100"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-gray-800 transition hover:bg-gray-100"
            aria-label="Panier"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pb-32 pt-2 md:px-8 lg:pb-36">
        <div className="grid gap-8 md:grid-cols-[1.05fr,1fr] lg:grid-cols-[1.1fr,1fr] lg:gap-12">
          <div className="flex justify-center">
            <div className="relative h-72 w-full max-w-[380px] overflow-hidden rounded-3xl bg-gray-50 shadow-sm sm:h-80 md:max-w-full lg:h-[440px]">
              {product.imagePath ? (
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 88vw, (max-width: 1024px) 46vw, 560px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-center text-sm font-montserrat text-gray-500">
                  Aperçu indisponible
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <section className="mt-2 space-y-1 md:mt-0">
              <h1 className="text-xl font-semibold leading-snug text-gray-900 sm:text-2xl lg:text-[1.7rem]">
                {product.name}
              </h1>
              <p className="text-sm text-gray-600">
                Par{" "}
                <span className="font-semibold text-[color:var(--color-creator,#4b2d52)]">{product.couturierName}</span>
              </p>
              <p className="text-sm text-gray-900">
                Taille: <span className="font-semibold text-gray-900">{selectedSize}</span>
              </p>
            </section>

            <section className="mt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
                  {sizeOptions.map((size) => {
                    const isActive = size === selectedSize;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-10 items-center justify-center rounded-md border text-sm font-semibold transition ${isActive
                          ? "border-[color:var(--color-creator,#4b2d52)] bg-[color:var(--color-creator,#4b2d52)] text-white"
                          : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                          }`}
                        aria-pressed={isActive}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <div className="sm:ml-3">
                  <button
                    type="button"
                    className="text-sm font-semibold text-[color:var(--color-creator,#4b2d52)] underline underline-offset-2"
                  >
                    Guide des tailles
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-6 space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-lusitana text-gray-900 sm:text-4xl">{priceLabel}</p>
                {product.stock > 0 ? (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {product.stock} en stock
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Rupture
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Star className="h-4 w-4 text-amber-500" />
                  Description
                </div>
                <p className="mt-2 text-sm leading-relaxed text-black sm:text-base">
                  {expanded ? product.description || "Aucune description fournie." : shortDescription}
                </p>
                {showToggle && (
                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-2 text-sm font-semibold text-[color:var(--color-creator,#4b2d52)]"
                  >
                    {expanded ? "Afficher moins" : "Plus"}
                  </button>
                )}
              </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {[
                { label: "Catégorie", value: categoryLabel },
                { label: "Couleur", value: colorLabel },
                { label: "Ajouté", value: addedAgoLabel },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between px-4 py-3 text-sm text-gray-900 sm:text-base ${index < 2 ? "border-b border-gray-200" : ""
                    }`}
                >
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  <span className="text-gray-900">{item.value}</span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 px-5 pb-6 pt-3 shadow-[0_-6px_30px_rgba(0,0,0,0.06)] backdrop-blur md:px-8">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--color-creator,#4b2d52)] px-6 py-3 text-base font-semibold text-white transition hover:opacity-95"
        >
          <ShoppingCart className="h-5 w-5" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
