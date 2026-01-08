"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function AppHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const accountType = user?.accountType;
  const actionItem =
    accountType === "couturier"
      ? { href: "/produit", label: "Nouveau produit" }
      : accountType === "fournisseur"
        ? { href: "/tissu", label: "Nouveau tissu" }
        : accountType === "acheteur"
          ? { href: "/nouveau-projet", label: "Nouveau projet" }
          : null;

  const navItems = [
    { href: "/marketplace", label: "Marketplace" },
    ...(actionItem ? [actionItem] : []),
    { href: "/annuaire", label: "Annuaire" },
    { href: "/commandes", label: "Commandes" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-lusitana text-lg tracking-[0.35em] text-cyan-950">
          SLOWMODE
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-montserrat uppercase tracking-[0.2em] text-zinc-600 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${isActive ? "text-cyan-950" : "hover:text-cyan-950"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden items-center lg:flex">
            <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Rechercher"
              className="w-56 rounded-full border border-zinc-200 bg-white/70 py-2 pl-9 pr-3 text-xs font-montserrat text-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
            />
          </div>
          <Link
            href="/panier"
            className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition-colors hover:border-cyan-900 hover:text-cyan-950"
            aria-label="Panier"
          >
            <ShoppingCart className="h-4 w-4" />
          </Link>
          <Link
            href="/profil"
            className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition-colors hover:border-cyan-900 hover:text-cyan-950"
            aria-label="Profil"
          >
            <UserRound className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition-colors hover:border-cyan-900 hover:text-cyan-950 lg:hidden"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-zinc-100 bg-white/95 px-6 py-4 lg:hidden">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Rechercher"
              className="w-full bg-transparent text-xs font-montserrat text-zinc-700 focus:outline-none"
            />
          </div>
          <div className="grid gap-3 text-sm font-montserrat text-zinc-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-sm transition-colors hover:border-cyan-900 hover:text-cyan-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
