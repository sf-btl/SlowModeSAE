"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

type Field = {
  id: string;
  label: string;
};

const CATEGORY_FIELDS: Record<string, Field[]> = {
  tops: [
    { id: "taille", label: "Taille (hauteur totale) (cm)" },
    { id: "poitrine", label: "Tour de poitrine (cm)" },
    { id: "tailleTour", label: "Tour de taille (cm)" },
    { id: "epaules", label: "Largeur d'épaules (cm)" },
    { id: "bras", label: "Longueur de bras (cm)" },
  ],
  bottoms: [
    { id: "tailleTour", label: "Tour de taille (cm)" },
    { id: "hanches", label: "Tour de hanches (cm)" },
    { id: "entrejambe", label: "Entrejambe (cm)" },
    { id: "longueurBas", label: "Longueur totale du bas (cm)" },
  ],
  "full-body": [
    { id: "taille", label: "Taille (hauteur totale) (cm)" },
    { id: "poitrine", label: "Tour de poitrine (cm)" },
    { id: "tailleTour", label: "Tour de taille (cm)" },
    { id: "hanches", label: "Tour de hanches (cm)" },
    { id: "epauleTaille", label: "Longueur épaule-taille (cm)" },
  ],
  outerwear: [
    { id: "taille", label: "Taille (hauteur totale) (cm)" },
    { id: "poitrine", label: "Tour de poitrine (avec aisance) (cm)" },
    { id: "epaules", label: "Largeur d'épaules (cm)" },
    { id: "biceps", label: "Tour de bras (biceps) (cm)" },
  ],
  lingerie: [
    { id: "dessousPoitrine", label: "Tour de dessous de poitrine (cm)" },
    { id: "poitrine", label: "Tour de poitrine (cm)" },
    { id: "bassin", label: "Tour de bassin (cm)" },
  ],
  accessories: [
    { id: "tete", label: "Tour de tête (bonnets/bandeaux) (cm)" },
    { id: "tailleTour", label: "Tour de taille (ceintures) (cm)" },
  ],
};

export default function MensurationsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "tops";

  const fields = useMemo(
    () => CATEGORY_FIELDS[category] ?? CATEGORY_FIELDS.tops,
    [category]
  );

  return (
    <div className="min-h-screen bg-[#f3f1f6] font-montserrat text-[#1e1b24]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-24 pt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#3c2a5d]">
          Etape 5 sur 5
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#dcd7e3]">
          <div className="h-full w-full rounded-full bg-[#3c2a5d]" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-[#1e1b24]">
            Soumettre vos mensurations
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#3a3640]">
            Prenez un moment pour renseigner vos mesures actuelles. Un vêtement
            parfaitement ajusté dure plus longtemps et réduit les retours
            inutiles, participant ainsi à une mode plus durable et responsable.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {fields.map((field) => (
            <label key={field.id} className="block text-sm text-[#3a3640]">
              {field.label}
              <input
                type="number"
                inputMode="decimal"
                className="mt-2 w-full rounded-xl border border-[#d6d1dd] bg-white px-4 py-3 text-sm text-[#1e1b24] focus:outline-none focus:ring-2 focus:ring-[#3c2a5d]"
                placeholder="0"
              />
            </label>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="button"
            className="w-full rounded-full bg-[#3c2a5d] py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#34214f]"
          >
            Soumettre mon projet
          </button>
        </div>
      </div>

      <BottomNavClientWrapper />
    </div>
  );
}
