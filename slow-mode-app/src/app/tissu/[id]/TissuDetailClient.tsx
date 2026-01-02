"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from '@/components/CartProvider';

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
    const { addToCart, getTotalItems } = useCart();
    const [metrage, setMetrage] = useState(1);
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    const priceLabel = useMemo(() => formatPriceEUR(tissu.price), [tissu.price]);
    const nameLabel = `${tissu.matiere} ${tissu.couleur}`;

    const handleAddToCart = () => {
        if (tissu.metrage_dispo <= 0) return;

        addToCart({
            id: tissu.id,
            type: 'tissu',
            nom: nameLabel,
            prix: tissu.price,
            image: tissu.imagePath,
            metrage: metrage,
            unite: 'm',
        });

        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 3000);
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
        <div className="flex min-h-screen flex-col bg-white pb-24">
            {/* Message de confirmation */}
            {showAddedMessage && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-montserrat animate-bounce">
                    ✓ Tissu ajouté au panier
                </div>
            )}

            <header className="px-4 pt-10 pb-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-full p-2 text-gray-800 transition hover:bg-gray-100"
                    aria-label="Retour"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded-full p-2 text-gray-800 transition hover:bg-gray-100"
                        aria-label="Rechercher"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/panier')}
                        className="relative rounded-full p-2 text-gray-800 transition hover:bg-gray-100"
                        aria-label="Panier"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="mx-auto w-full max-w-2xl px-4 space-y-6">
                {/* IMAGE */}
                <div className="flex justify-center">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm">
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
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-center text-sm font-montserrat text-gray-500">
                                Aperçu indisponible
                            </div>
                        )}
                    </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col">
                    <section className="space-y-1">
                        <h1 className="text-xl font-semibold leading-snug text-gray-900 sm:text-2xl">
                            {nameLabel}
                        </h1>
                        <p className="text-sm text-gray-900">
                            Fourni par{" "}
                            <span className="font-semibold text-[color:var(--color-creator,#4b2d52)]">
                                {tissu.fournisseurName}
                            </span>
                        </p>
                    </section>

                    <section className="mt-6 space-y-3">
                        <div className="flex flex-wrap items-end gap-3">
                            <p className="text-3xl font-lusitana text-gray-900 sm:text-4xl">
                                {priceLabel} <span className="text-base font-normal text-gray-900">/ mètre</span>
                            </p>
                            {tissu.metrage_dispo > 0 ? (
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    {tissu.metrage_dispo}m en stock
                                </span>
                            ) : (
                                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                    Rupture de stock
                                </span>
                            )}
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <Star className="h-4 w-4 text-amber-500" />
                                Caractéristiques
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-900 text-xs">Matière</span>
                                    <span className="font-medium text-black">{tissu.matiere}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-900 text-xs">Couleur</span>
                                    <span className="font-medium text-black">{tissu.couleur}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-900 text-xs">Grammage</span>
                                    <span className="font-medium text-black">
                                        {tissu.grammage ? `${tissu.grammage} g/m²` : "Non spécifié"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sélecteur de métrage */}
                        {tissu.metrage_dispo > 0 && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-gray-900">
                                        Métrage souhaité
                                    </span>
                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                                        <button
                                            onClick={decrementMetrage}
                                            className="text-gray-700 hover:text-gray-900 font-bold text-xl"
                                            disabled={metrage <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="font-semibold text-gray-900 min-w-[3ch] text-center">
                                            {metrage}m
                                        </span>
                                        <button
                                            onClick={incrementMetrage}
                                            className="text-gray-700 hover:text-gray-900 font-bold text-xl"
                                            disabled={metrage >= tissu.metrage_dispo}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">Total</span>
                                    <span className="text-xl font-bold text-gray-900 font-lusitana">
                                        {formatPriceEUR(totalPrice)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 px-5 pb-6 pt-3 shadow-[0_-6px_30px_rgba(0,0,0,0.06)] backdrop-blur">
                <div className="mx-auto w-full max-w-2xl px-4">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={tissu.metrage_dispo <= 0}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-semibold text-white transition ${
                            tissu.metrage_dispo > 0
                                ? 'bg-[color:var(--color-creator,#4b2d52)] hover:opacity-95'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {tissu.metrage_dispo > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                    </button>
                </div>
            </div>
        </div>
    );
}