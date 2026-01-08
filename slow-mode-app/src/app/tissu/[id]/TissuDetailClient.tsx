"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ShoppingCart, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export type TissuDetailViewModel = {
  id: number;
  matiere: string;
  couleur: string;
  grammage: number | null;
  price: number;
  imagePath: string | null;
  metrage_dispo: number;
  fournisseurName: string;
};

function formatPriceEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function TissuDetailClient({ tissu }: { tissu: TissuDetailViewModel }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectionMode = searchParams.get("selection") === "1";
  const categoryParam = searchParams.get("category");
  const { addToCart, getTotalItems } = useCart();
  const [metrage, setMetrage] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const priceLabel = useMemo(() => formatPriceEUR(tissu.price), [tissu.price]);
  const nameLabel = `${tissu.matiere} ${tissu.couleur}`;

  const handleAddToCart = () => {
    if (tissu.metrage_dispo <= 0) return;

    addToCart({
      id: tissu.id,
      type: "tissu",
      nom: nameLabel,
      prix: tissu.price,
      image: tissu.imagePath,
      metrage: metrage,
      unite: "m",
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleSelectTissu = () => {
    const category = categoryParam ? `&category=${categoryParam}` : "";
    const draft = JSON.parse(localStorage.getItem("projetDraft") || "{}");
    localStorage.setItem("projetDraft", JSON.stringify({ ...draft, tissuId: tissu.id }));
    router.push(`/nouveau-projet/description?tissu=${tissu.id}${category}`);
  };

  const incrementMetrage = () => {
    if (metrage < tissu.metrage_dispo) {
      setMetrage(metrage + 1);
    }
  };

  const decrementMetrage = () => {
    if (metrage > 1) {
      setMetrage(metrage - 1);
    }
  };

  const cartItemCount = getTotalItems();
  const totalPrice = tissu.price * metrage;

  return (
    <div className="flex min-h-screen flex-col text-zinc-900">
      {showAddedMessage && !selectionMode && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg font-montserrat animate-bounce">
          Tissu ajoute au panier
        </div>
      )}

      <main className="mx-auto w-full max-w-2xl px-4 space-y-6 pb-28 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {!selectionMode && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/panier")}
                className="relative rounded-full p-2 text-zinc-700 transition hover:bg-zinc-100"
                aria-label="Panier"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-50 shadow-sm">
            {tissu.imagePath ? (
              <Image
                src={tissu.imagePath}
                alt={nameLabel}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-center text-sm font-montserrat text-zinc-500">
                Apercu indisponible
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <section className="space-y-1">
            <h1 className="text-xl font-semibold leading-snug text-zinc-900 sm:text-2xl">
              {nameLabel}
            </h1>
            <p className="text-sm text-zinc-700">
              Fourni par <span className="font-semibold text-cyan-950">{tissu.fournisseurName}</span>
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-3xl font-lusitana text-zinc-900 sm:text-4xl">
                {priceLabel} <span className="text-base font-normal text-zinc-700">/ metre</span>
              </p>
              {tissu.metrage_dispo > 0 ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {tissu.metrage_dispo}m en stock
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Rupture de stock
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <Star className="h-4 w-4 text-amber-500" />
                Caracteristiques
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-zinc-700 text-xs">Matiere</span>
                  <span className="font-medium text-zinc-900">{tissu.matiere}</span>
                </div>
                <div>
                  <span className="block text-zinc-700 text-xs">Couleur</span>
                  <span className="font-medium text-zinc-900">{tissu.couleur}</span>
                </div>
                <div>
                  <span className="block text-zinc-700 text-xs">Grammage</span>
                  <span className="font-medium text-zinc-900">
                    {tissu.grammage ? `${tissu.grammage} g/m2` : "Non specifie"}
                  </span>
                </div>
              </div>
            </div>

            {tissu.metrage_dispo > 0 && !selectionMode && (
              <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-zinc-900">Metrage souhaite</span>
                  <div className="flex items-center gap-3 bg-zinc-100 rounded-lg px-3 py-2">
                    <button
                      onClick={decrementMetrage}
                      className="text-zinc-700 hover:text-zinc-900 font-bold text-xl"
                      disabled={metrage <= 1}
                    >
                      -
                    </button>
                    <span className="font-semibold text-zinc-900 min-w-[3ch] text-center">
                      {metrage}m
                    </span>
                    <button
                      onClick={incrementMetrage}
                      className="text-zinc-700 hover:text-zinc-900 font-bold text-xl"
                      disabled={metrage >= tissu.metrage_dispo}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                  <span className="text-sm text-zinc-600">Total</span>
                  <span className="text-xl font-bold text-zinc-900 font-lusitana">
                    {formatPriceEUR(totalPrice)}
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-100 bg-white/95 px-5 pb-6 pt-3 shadow-[0_-6px_30px_rgba(0,0,0,0.06)] backdrop-blur">
        <div className="mx-auto w-full max-w-2xl px-4">
          {selectionMode ? (
            <button
              type="button"
              onClick={handleSelectTissu}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition bg-cyan-950 hover:opacity-95"
            >
              Je choisis ce tissu
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={tissu.metrage_dispo <= 0}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition ${
                tissu.metrage_dispo > 0 ? "bg-cyan-950 hover:opacity-95" : "bg-zinc-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {tissu.metrage_dispo > 0 ? "Ajouter au panier" : "Rupture de stock"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
