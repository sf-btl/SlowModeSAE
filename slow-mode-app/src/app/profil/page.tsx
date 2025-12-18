"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";
import { useAuth } from "@/components/AuthProvider";
import {
  type LucideIcon,
  ChevronRight,
  Heart,
  Info,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
  UserRound,
} from "lucide-react";

type MenuAction = {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
};

const accentColor = "text-[#4b2d52]";

function MenuButton({ label, icon: Icon, href, onClick }: MenuAction) {
  const content = (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 ${accentColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="flex-1 text-left text-sm font-montserrat text-gray-900">{label}</span>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block border-b border-gray-200 last:border-0 transition-colors hover:bg-gray-50"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-b border-gray-200 last:border-0 text-left transition-colors hover:bg-gray-50"
    >
      {content}
    </button>
  );
}

export default function ProfilPage() {
  const { user, loading, error, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fullName = useMemo(() => {
    if (!user) return "";
    const parts = [user.prenom, user.nom].filter(Boolean);
    return parts.length ? parts.join(" ") : user.email;
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return "?";
    const first = user.prenom?.[0] ?? "";
    const last = user.nom?.[0] ?? "";
    const initialsValue = `${first}${last}`.trim();
    return initialsValue ? initialsValue.toUpperCase() : user.email?.[0]?.toUpperCase() ?? "?";
  }, [user]);

  const accountLabel = useMemo(() => {
    switch (user?.accountType) {
      case "acheteur":
      case "particulier":
        return "Acheteur responsable";
      case "couturier":
      case "professionnel":
        return "Créateur de qualité";
      case "fournisseur":
      case "entreprise":
        return "Fournisseur engagé";
      default:
        return "Profil SlowMode";
    }
  }, [user?.accountType]);

  const locationLabel = "Localité non renseignée";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="w-full px-4 pt-10 pb-4">
          <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-300 border-t-[#4b2d52]" />
        </div>
        <BottomNavClientWrapper />
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="w-full px-4 pt-10 pb-4">
          <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-sm font-montserrat text-gray-700">
            {error || "Vous devez être connecté pour voir votre profil."}
          </p>
          <Link
            href="/login"
            className="rounded-md bg-[#4b2d52] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3c1f42]"
          >
            Se connecter
          </Link>
        </div>
        <BottomNavClientWrapper />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white text-gray-900">
        <header className="w-full px-4 pt-10 pb-4">
          <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
        </header>

        <main className="flex-1 pb-24">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4">
            <section className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 px-4 py-6 shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4b2d52] text-2xl font-semibold text-white">
                {initials}
              </div>
              <div className="text-center">
                <p className="text-2xl font-lusitana leading-snug text-[#4b2d52]">{fullName}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#4b2d52]">
                    {accountLabel}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-center gap-2 text-sm font-montserrat text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{locationLabel}</span>
                </div>
                <p className="mt-1 text-sm font-montserrat text-gray-600">{user.email}</p>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <MenuButton label="Mon profil" icon={UserRound} href="/profil" />
              <MenuButton label="Articles favoris" icon={Heart} />
              <MenuButton label="Mes commandes" icon={ShoppingBag} />
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <MenuButton label="Paramètres" icon={Settings} />
              <MenuButton label="À propos de SlowMode" icon={Info} />
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <MenuButton label="Déconnexion" icon={LogOut} onClick={() => setShowConfirm(true)} />
            </section>
          </div>
        </main>

        <BottomNavClientWrapper />
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-3">
              <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 ${accentColor}`}>
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Confirmer la déconnexion</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Vous allez être redirigé vers l’accueil. Voulez-vous continuer ?
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full rounded-md bg-[#4b2d52] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3c1f42] disabled:cursor-not-allowed disabled:opacity-75 sm:w-auto"
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
