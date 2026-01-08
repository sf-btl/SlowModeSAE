"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, MapPin } from "lucide-react";

type UserProfile = {
  id: number;
  navn: string;
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
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-200 border-t-cyan-950" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-100 bg-white/80 p-6 text-center">
        <p className="mb-4 text-sm text-zinc-500">{error || "Profil introuvable"}</p>
        <Link href="/annuaire" className="text-cyan-950 underline">
          Retour a l'annuaire
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
      ? "Createur de qualite"
      : profile.role === "fournisseur"
      ? "Fournisseur engage"
      : "Membre SlowMode";

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <Link
        href="/annuaire"
        className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Link>

      <section className="flex flex-col items-center gap-3 rounded-3xl border border-zinc-100 bg-white/80 px-6 py-8 shadow-sm">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-950 text-3xl font-semibold text-white shadow-md">
          {initials}
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold font-lusitana text-cyan-950">{profile.navn}</h1>

          <span className="mt-2 inline-block rounded-full bg-cyan-950/10 px-3 py-1 text-xs font-semibold text-cyan-950">
            {accountLabel}
          </span>

          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-600">
            <MapPin className="h-4 w-4" />
            <span>
              {profile.ville && profile.ville.trim() !== ""
                ? profile.ville
                : profile.adresse_postale && profile.adresse_postale.trim() !== ""
                ? profile.adresse_postale
                : "Localite non renseignee"}
            </span>
          </div>

          {profile.description && (
            <p className="mt-4 text-sm text-zinc-600 max-w-xs mx-auto">
              {profile.description}
            </p>
          )}
        </div>
      </section>

      {profile.role === "couturier" && (
        <section className="rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-sm">
          <Link
            href={`/nouveau-projet?couturierId=${profile.id}`}
            className="block w-full rounded-full bg-cyan-950 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900"
          >
            Nouveau projet
          </Link>
        </section>
      )}

      <section className="rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
          <ImageIcon className="h-5 w-5 text-cyan-950" />
          <h2 className="text-sm font-semibold text-zinc-900">Publications</h2>
          <span className="text-xs text-zinc-500">({profile.posts.length})</span>
        </div>

        {profile.posts.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 py-8">
            Aucune publication pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {profile.posts.map((post) => {
              let href = "#";
              if (post.produitId) href = `/produit/${post.produitId}`;
              else if (post.tissuId) href = `/tissu/${post.tissuId}`;

              return (
                <Link
                  key={post.id}
                  href={href}
                  className="aspect-square overflow-hidden rounded-md bg-zinc-100 block transition hover:opacity-90 relative"
                >
                  {post.photo_resultat ? (
                    <img src={post.photo_resultat} alt="Post" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-200">
                      <span className="text-xs text-zinc-400">Sans image</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
