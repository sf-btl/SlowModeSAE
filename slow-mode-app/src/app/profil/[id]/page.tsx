"use client";

import { useEffect, useState, use } from "react"; // Added 'use' for params unwrapping
import Link from "next/link";
import { ArrowLeft, MapPin, Image as ImageIcon } from "lucide-react";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

type UserProfile = {
    id: number;
    navn: string; // Nom affiché (Nom complet ou Nom société)
    role: string;
    description: string;
    posts: {
        id: number;
        photo_resultat: string | null;
        produitId?: number | null;
        tissuId?: number | null;
    }[];
};

export default function PublicProfilPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() or await (Next.js 15 recommendation is async params)
    // Since this is a client component, user params promise needs handling.
    // Actually in client components 'params' is a Promise in Next 15.
    // Let's use `use(params)` logic or simple useEffect with unwrapping if simple.
    // Using standard async/await pattern inside useEffect is safest for now without 'use' hook if version < 19/15.
    // But let's assume standard Next.js 14/15 behavior where we can treat it as Promise or just use it.
    // Hack: We'll wait for params inside a useEffect or use 'use' if available. 
    // Let's simplify and assume we can just unwrap it.

    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!resolvedParams) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/user/${resolvedParams.id}`);
                const json = await res.json();
                if (json.success) {
                    setProfile(json.data);
                } else {
                    setError(json.message);
                }
            } catch (err) {
                setError("Impossible de charger le profil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [resolvedParams]);


    if (loading || !resolvedParams) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-300 border-t-[#4b2d52]" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
                <p className="mb-4 text-center text-gray-500">{error || "Profil introuvable"}</p>
                <Link href="/annuaire" className="text-[#4b2d52] underline">
                    Retour à l'annuaire
                </Link>
            </div>
        );
    }

    const initials = profile.navn
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const accountLabel =
        profile.role === "couturier"
            ? "Créateur de qualité"
            : profile.role === "fournisseur"
                ? "Fournisseur engagé"
                : "Membre SlowMode";

    return (
        <div className="min-h-screen bg-white pb-24 font-inter">
            {/* HEADER */}
            <header className="px-4 pt-6 pb-2">
                <Link href="/annuaire" className="inline-flex items-center text-sm text-gray-500 hover:text-black">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Retour
                </Link>
            </header>

            <main className="mx-auto w-full max-w-lg px-4 space-y-6">
                {/* INFO CARD */}
                <section className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 px-4 py-8 shadow-sm">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4b2d52] text-3xl font-semibold text-white shadow-md">
                        {initials}
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold font-lusitana text-[#4b2d52]">
                            {profile.navn}
                        </h1>

                        <span className="mt-2 inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#4b2d52]">
                            {accountLabel}
                        </span>

                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>Localité non renseignée</span>
                        </div>

                        {profile.description && (
                            <p className="mt-4 text-sm text-gray-700 max-w-xs mx-auto">
                                {profile.description}
                            </p>
                        )}
                    </div>
                </section>

                {profile.role === "couturier" && (
                    <section className="rounded-2xl bg-white p-4 shadow-sm">
                        <Link
                            href={`/nouveau-projet?couturierId=${profile.id}`}
                            className="block w-full rounded-full bg-[#3c2a5d] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#34214f]"
                        >
                            Nouveau projet
                        </Link>
                    </section>
                )}

                {/* POSTS */}
                <section className="rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 border-b pb-2">
                        <ImageIcon className="h-5 w-5 text-[#4b2d52]" />
                        <h2 className="text-sm font-semibold text-gray-900">Publications</h2>
                        <span className="text-xs text-gray-500">({profile.posts.length})</span>
                    </div>

                    {profile.posts.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-8">
                            Aucune publication pour le moment.
                        </p>
                    ) : (
                        <div className="grid grid-cols-3 gap-1 sm:gap-2">
                            {profile.posts.map((post) => {
                                let href = "#";
                                // Si on veut rendre les posts cliquables vers le produit/tissu associé
                                if (post.produitId) href = `/produit/${post.produitId}`;
                                else if (post.tissuId) href = `/tissu/${post.tissuId}`;

                                return (
                                    <Link
                                        key={post.id}
                                        href={href}
                                        className="aspect-square overflow-hidden rounded-md bg-gray-100 block transition hover:opacity-90 relative"
                                    >
                                        {post.photo_resultat ? (
                                            <img
                                                src={post.photo_resultat}
                                                alt="Post"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                                <span className="text-xs text-gray-400">Sans image</span>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <BottomNavClientWrapper />
        </div>
    );
}
