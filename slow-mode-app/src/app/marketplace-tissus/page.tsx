"use client";

import { useState, useEffect, useMemo } from "react";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";
import Link from "next/link";
import Image from "next/image";

type Tissu = {
    id: number;
    matiere: string;
    couleur: string;
    grammage: number;
    prix_unitaire: number;
    imagePath: string;
    fournisseur: {
        nom_societe: string;
    };
};

export default function MarketplaceTissusPage() {
    const [tissus, setTissus] = useState<Tissu[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTissus = async () => {
            try {
                const res = await fetch("/api/tissu");
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des tissus");
                }
                const data = await res.json();
                if (data.success) {
                    setTissus(data.tissus);
                } else {
                    setError(data.message || "Impossible de charger les tissus.");
                }
            } catch (err) {
                console.error(err);
                setError("Erreur serveur.");
            } finally {
                setLoading(false);
            }
        };

        fetchTissus();
    }, []);

    const filteredTissus = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return tissus.filter(t =>
            t.matiere.toLowerCase().includes(lowerSearch) ||
            t.couleur.toLowerCase().includes(lowerSearch) ||
            t.fournisseur.nom_societe.toLowerCase().includes(lowerSearch)
        );
    }, [tissus, searchTerm]);

    return (
        <div className="min-h-screen bg-[#f2f2f2] font-inter pb-24">
            <div className="w-full px-4">
                {/* Header / Search */}
                <div className="bg-white px-6 pt-6 pb-4 shadow-sm sticky top-0 z-10 rounded-b-2xl mb-4">
                    <h1 className="text-2xl font-lusitana text-[#1f1c24] mb-4">
                        Tissus
                    </h1>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 rounded-full bg-[#f2f2f2] px-4 py-2">
                        <span className="text-[#3c2a5d]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="m21 21-4.3-4.3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                        <input
                            type="search"
                            placeholder="Rechercher une matière, couleur..."
                            className="bg-transparent w-full text-sm text-[#3c2a5d] placeholder-[#a39ab5] focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Chargement...</div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : filteredTissus.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Aucun tissu trouvé.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredTissus.map((tissu) => (
                                <Link href={`/tissu/${tissu.id}`} key={tissu.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                    {/* Image */}
                                    <div className="relative aspect-square w-full bg-gray-100">
                                        <Image
                                            src={tissu.imagePath || "/placeholder-fabric.jpg"}
                                            alt={`${tissu.matiere} ${tissu.couleur}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-semibold text-[#1f1c24] text-sm line-clamp-1">
                                            {tissu.matiere} - {tissu.couleur}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                            {tissu.fournisseur.nom_societe}
                                        </p>

                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                            <span className="font-bold text-[#3c2a5d] text-sm">
                                                {tissu.prix_unitaire} €<span className="text-xs font-normal">/m</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BottomNavClientWrapper />
        </div>
    );
}
