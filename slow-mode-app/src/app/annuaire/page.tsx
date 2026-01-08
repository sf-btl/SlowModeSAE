"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

type SortOption = "pertinence" | "distance" | "note";

type DirectoryEntry = {
  id: string;
  name: string;
  role: "Createur" | "Fournisseur";
  rating: number;
  locationHint?: string;
  originalIndex: number;
};

const SORT_LABELS: Record<SortOption, string> = {
  pertinence: "Pertinence",
  distance: "Distance",
  note: "Note",
};

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function formatDistancePlaceholder() {
  return "-";
}

export default function AnnuairePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("pertinence");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDirectory = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const response = await fetch("/api/annuaire", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Erreur lors du chargement de l'annuaire.");
        }
        const data = (await response.json()) as {
          entries: Omit<DirectoryEntry, "originalIndex">[];
        };
        if (!isMounted) return;
        const hydrated = data.entries.map((entry, index) => ({
          ...entry,
          originalIndex: index,
        }));
        setEntries(hydrated);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setErrorMessage("Impossible de charger l'annuaire.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDirectory();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return entries;
    return entries.filter((entry) => {
      const name = entry.name.toLowerCase();
      const role = entry.role.toLowerCase();
      return name.includes(normalized) || role.includes(normalized);
    });
  }, [entries, searchTerm]);

  const sortedEntries = useMemo(() => {
    const sorted = [...filteredEntries];
    if (sortOption === "pertinence") {
      sorted.sort((a, b) => a.originalIndex - b.originalIndex);
      return sorted;
    }
    if (sortOption === "note") {
      sorted.sort((a, b) => b.rating - a.rating);
      return sorted;
    }
    sorted.sort((a, b) => a.originalIndex - b.originalIndex);
    return sorted;
  }, [filteredEntries, sortOption]);

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Annuaire</p>
        <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">
          Trouver un artisan ou un fournisseur
        </h1>
      </div>

      <div className="space-y-4 rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2">
            <span className="text-zinc-400" aria-hidden="true">
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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher"
              className="w-full bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
              type="search"
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500"
            aria-disabled="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="7" cy="6" r="2" fill="currentColor" />
              <circle cx="17" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="18" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="flex rounded-full bg-zinc-100 p-1 text-sm font-semibold text-zinc-600">
          <button
            type="button"
            className="flex-1 rounded-full bg-cyan-950 px-4 py-2 text-white"
          >
            Liste
          </button>
          <button
            type="button"
            className="flex-1 rounded-full px-4 py-2 text-zinc-600"
            aria-disabled="true"
          >
            Carte
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="font-medium">Trier par :</span>
          <button
            type="button"
            className="flex items-center gap-1 font-semibold text-cyan-950"
            onClick={() => setIsSortOpen(true)}
          >
            {SORT_LABELS[sortOption]}
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 7l5 6 5-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {errorMessage ? (
          <div className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-zinc-500 shadow-sm">
            {errorMessage}
          </div>
        ) : null}
        {isLoading ? (
          <div className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-zinc-500 shadow-sm">
            Chargement de l'annuaire...
          </div>
        ) : null}
        {sortedEntries.map((entry) => {
          const isCreator = entry.role === "Createur";
          const roleTextColor = isCreator ? "text-cyan-950" : "text-emerald-700";
          const roleBadgeColor = isCreator ? "bg-cyan-950" : "bg-emerald-700";

          return (
            <Link
              href={`/profil/${entry.id}`}
              key={`${entry.id}-${entry.role}`}
              className="flex items-center gap-4 rounded-3xl border border-zinc-100 bg-white/80 px-5 py-4 shadow-sm transition hover:border-cyan-950"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold font-lusitana text-white shadow ${roleBadgeColor}`}
              >
                {getInitials(entry.name)}
              </div>
              <div className="flex flex-1 flex-col gap-1 text-zinc-900">
                <div className="text-sm font-bold font-lusitana">{entry.name}</div>
                <div className={`text-xs font-semibold ${roleTextColor}`}>{entry.role}</div>
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <span className="inline-flex items-center gap-1 font-semibold text-zinc-900">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="m12 3 2.7 5.5 6.1.9-4.4 4.2 1 6.1L12 17l-5.4 2.7 1-6.1-4.4-4.2 6.1-.9L12 3Z"
                        fill="#f59e0b"
                      />
                    </svg>
                    {entry.rating}
                  </span>
                  <span className="font-semibold">{formatDistancePlaceholder()}</span>
                </div>
              </div>
            </Link>
          );
        })}
        {!isLoading && !errorMessage && sortedEntries.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-zinc-500 shadow-sm">
            Aucun profil ne correspond a votre recherche.
          </div>
        ) : null}
      </div>

      {isSortOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center pb-12">
          <button
            type="button"
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSortOpen(false)}
            aria-label="Fermer la fenetre de tri"
          />
          <div className="relative w-full max-w-md rounded-t-3xl bg-white px-6 pb-8 pt-5 shadow-xl">
            <div className="flex justify-center">
              <span className="h-1 w-12 rounded-full bg-zinc-200" />
            </div>
            <h2 className="mt-4 text-center text-lg font-semibold text-zinc-900">Trier par:</h2>
            <div className="mt-6 flex flex-col gap-4 text-sm">
              {(["pertinence", "distance", "note"] as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className="flex items-center justify-between text-left font-semibold text-zinc-700"
                  onClick={() => {
                    setSortOption(option);
                    setIsSortOpen(false);
                  }}
                >
                  <span>{SORT_LABELS[option]}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      sortOption === option ? "border-cyan-950" : "border-zinc-200"
                    }`}
                  >
                    {sortOption === option ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-950" />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
