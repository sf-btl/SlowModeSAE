"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  ChevronRight,
  Heart,
  Info,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
  UserRound,
  Image as ImageIcon,
} from "lucide-react";

type Post = {
  id: number;
  photo_resultat: string | null;
  produitId?: number | null;
  tissuId?: number | null;
};

function MenuButton({
  label,
  icon: Icon,
  href,
  onClick,
}: {
  label: string;
  icon: any;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950/10 text-cyan-950">
        <Icon className="h-5 w-5" />
      </div>
      <span className="flex-1 text-sm font-montserrat text-zinc-900">{label}</span>
      <ChevronRight className="h-4 w-4 text-zinc-500" />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-b border-zinc-100 last:border-0 text-left hover:bg-zinc-50"
    >
      {content}
    </button>
  );
}

export default function ProfilPage() {
  const { user, loading, error, logout } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fullName = useMemo(() => {
    if (!user) return "";
    return [user.prenom, user.nom].filter(Boolean).join(" ") || user.email;
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return "?";
    return (
      `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      "?"
    );
  }, [user]);

  const accountLabel = useMemo(() => {
    switch (user?.accountType) {
      case "couturier":
        return "Createur de qualite";
      case "fournisseur":
        return "Fournisseur engage";
      case "acheteur":
        return "Acheteur responsable";
      default:
        return "Profil SlowMode";
    }
  }, [user?.accountType]);

  const canShowPosts =
    user?.accountType === "couturier" || user?.accountType === "fournisseur";

  useEffect(() => {
    if (!canShowPosts) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/me");
        const json = await res.json();
        if (json.success) {
          setPosts(json.data);
        }
      } catch (e) {
        console.error("Erreur chargement posts", e);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [canShowPosts]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-200 border-t-cyan-950" />
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-100 bg-white/80 px-6 py-10 text-center">
        <p className="mb-4 text-sm text-zinc-600">
          Vous devez etre connecte pour voir votre profil.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-cyan-950 px-6 py-3 text-sm font-semibold text-white"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Compte</p>
          <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">Profil</h1>
        </div>

        <section className="flex flex-col items-center gap-3 rounded-3xl border border-zinc-100 bg-white/80 px-6 py-8 shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-950 text-2xl font-semibold text-white">
            {initials}
          </div>

          <div className="text-center">
            <p className="text-2xl font-lusitana text-cyan-950">{fullName}</p>

            <span className="mt-2 inline-block rounded-full bg-cyan-950/10 px-3 py-1 text-xs font-semibold text-cyan-950">
              {accountLabel}
            </span>

            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-zinc-600">
              <MapPin className="h-4 w-4" />
              <span>
                {user.ville && user.ville.trim() !== ""
                  ? user.ville
                  : user.adresse_postale && user.adresse_postale.trim() !== ""
                  ? user.adresse_postale
                  : "Localite non renseignee"}
              </span>
            </div>

            <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-zinc-100 bg-white/80 shadow-sm">
          <MenuButton label="Mon profil" icon={UserRound} href="/profil" />
          <MenuButton label="Articles favoris" icon={Heart} />
          {["couturier", "fournisseur"].includes(user.accountType) ? (
            <MenuButton label="Dashboard" icon={ShoppingBag} href="/dashboard" />
          ) : (
            <MenuButton label="Mes commandes" icon={ShoppingBag} href="/commandes" />
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-zinc-100 bg-white/80 shadow-sm">
          <MenuButton label="Parametres" icon={Settings} />
          <MenuButton label="A propos de SlowMode" icon={Info} />
        </section>

        {canShowPosts && (
          <section className="rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-cyan-950" />
              <h2 className="text-sm font-semibold text-zinc-900">Publications</h2>
            </div>

            {loadingPosts ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-lg bg-zinc-200" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-center text-sm text-zinc-600">
                Aucune publication pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {posts.map((post) => {
                  let href = "#";
                  if (post.produitId) href = `/produit/${post.produitId}`;
                  else if (post.tissuId) href = `/tissu/${post.tissuId}`;

                  return (
                    <Link
                      key={post.id}
                      href={href}
                      className="aspect-square overflow-hidden rounded-lg bg-zinc-100 block transition hover:opacity-90"
                    >
                      {post.photo_resultat && (
                        <img src={post.photo_resultat} alt="" className="h-full w-full object-cover" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <section className="overflow-hidden rounded-3xl border border-zinc-100 bg-white/80 shadow-sm">
          <MenuButton label="Deconnexion" icon={LogOut} onClick={() => setShowConfirm(true)} />
        </section>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Confirmer la deconnexion</h2>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-900"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-full bg-cyan-950 px-4 py-2 text-sm text-white"
              >
                {isLoggingOut ? "Deconnexion..." : "Se deconnecter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
