"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";
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

/* =======================
   TYPES
======================= */

type Post = {
  id: number;
  photo_resultat: string | null;
};

/* =======================
   MENU BUTTON
======================= */

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
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-[#4b2d52]">
        <Icon className="h-5 w-5" />
      </div>
      <span className="flex-1 text-sm font-montserrat text-gray-900">
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block border-b border-gray-200 last:border-0 hover:bg-gray-50"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-b border-gray-200 last:border-0 text-left hover:bg-gray-50"
    >
      {content}
    </button>
  );
}

/* =======================
   PAGE PROFIL
======================= */

export default function ProfilPage() {
  const { user, loading, error, logout } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* =======================
     DERIVED DATA
  ======================= */

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
        return "Créateur de qualité";
      case "fournisseur":
        return "Fournisseur engagé";
      case "acheteur":
        return "Acheteur responsable";
      default:
        return "Profil SlowMode";
    }
  }, [user?.accountType]);

  const canShowPosts =
    user?.accountType === "couturier" ||
    user?.accountType === "fournisseur";

  /* =======================
     FETCH POSTS
  ======================= */

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

  /* =======================
     LOGOUT
  ======================= */

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  /* =======================
     LOADING USER
  ======================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-300 border-t-[#4b2d52]" />
      </div>
    );
  }

  /* =======================
     NOT AUTH
  ======================= */

  if (!user || error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="mb-4 text-sm text-gray-700">
          Vous devez être connecté pour voir votre profil.
        </p>
        <Link
          href="/login"
          className="rounded-md bg-[#4b2d52] px-5 py-3 text-sm font-semibold text-white"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white pb-24">
        <header className="px-4 pt-10 pb-4">
          <h1 className="text-xl font-semibold">Profil</h1>
        </header>

        <main className="mx-auto w-full max-w-2xl px-4 space-y-6">
          {/* ===== PROFILE CARD ===== */}
          <section className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 px-4 py-6 shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4b2d52] text-2xl font-semibold text-white">
              {initials}
            </div>

            <div className="text-center">
              <p className="text-2xl font-lusitana text-[#4b2d52]">
                {fullName}
              </p>

              <span className="mt-2 inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#4b2d52]">
                {accountLabel}
              </span>

              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-700">
                <MapPin className="h-4 w-4" />
                <span>Localité non renseignée</span>
              </div>

              <p className="mt-1 text-sm text-gray-600">{user.email}</p>
            </div>
          </section>

          {/* ===== MENU ===== */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <MenuButton label="Mon profil" icon={UserRound} href="/profil" />
            <MenuButton label="Articles favoris" icon={Heart} />
            <MenuButton label="Mes commandes" icon={ShoppingBag} />
          </section>

          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <MenuButton label="Paramètres" icon={Settings} />
            <MenuButton label="À propos de SlowMode" icon={Info} />
          </section>

          {/* ===== POSTS ===== */}
          {canShowPosts && (
            <section className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#4b2d52]" />
                <h2 className="text-sm font-semibold">Publications</h2>
              </div>

              {loadingPosts ? (
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square animate-pulse rounded-lg bg-gray-200"
                    />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  Aucune publication pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      {post.photo_resultat && (
                        <img
                          src={post.photo_resultat}
                          alt="Publication"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ===== LOGOUT ===== */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <MenuButton
              label="Déconnexion"
              icon={LogOut}
              onClick={() => setShowConfirm(true)}
            />
          </section>
        </main>

        <BottomNavClientWrapper />
      </div>

      {/* ===== LOGOUT MODAL ===== */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-lg font-semibold">
              Confirmer la déconnexion
            </h2>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-md bg-[#4b2d52] px-4 py-2 text-sm text-white"
              >
                {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
