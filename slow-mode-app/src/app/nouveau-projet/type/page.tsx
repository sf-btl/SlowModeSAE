"use client";

import { useMemo, useState } from "react";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

type Category = {
  id: string;
  label: string;
  icon: string;
  description: string;
  items: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "tops",
    label: "Hauts",
    icon: "/icons/clothes%20(1).png",
    description:
      "Cette catégorie couvre tout vêtement s'enfilant par la tête ou se boutonnant sur le buste.",
    items: ["Chemises", "T-shirts", "Blouses", "Pulls", "Gilets", "Débardeurs"],
  },
  {
    id: "bottoms",
    label: "Bas",
    icon: "/icons/jeans.png",
    description: "Regroupe les pièces habillant la partie inférieure du corps.",
    items: ["Jupes", "Pantalons", "Jeans", "Shorts", "Bermudas"],
  },
  {
    id: "full-body",
    label: "Robes et\nCombinaisons",
    icon: "/icons/girl-dress.png",
    description: "Vêtements d'une seule pièce couvrant le haut et le bas du corps.",
    items: [
      "Robes de jour ou de soirée",
      "Combinaisons-pantalons",
      "Combi-shorts",
      "Salopettes",
    ],
  },
  {
    id: "outerwear",
    label: "Vêtements\nd'Extérieur",
    icon: "/icons/lab-coat.png",
    description:
      "Pièces structurées portées par-dessus d'autres vêtements pour la protection ou le style.",
    items: ["Vestes", "Manteaux", "Blazers", "Parkas", "Trenchs", "Imperméables"],
  },
  {
    id: "lingerie",
    label: "Lingerie, Bain\net Nuit",
    icon: "/icons/bathrobe.png",
    description:
      "Articles délicats ou techniques portés à même le corps ou pour le repos.",
    items: [
      "Pyjamas",
      "Chemises de nuit",
      "Sous-vêtements",
      "Maillots de bain",
      "Peignoirs",
    ],
  },
  {
    id: "accessories",
    label: "Accessoires et\nTextile Maison",
    icon: "/icons/scarf.png",
    description:
      "Tout ce qui complète une tenue ou concerne le linge de maison technique.",
    items: [
      "Écharpes",
      "Foulards",
      "Accessoires de tête (bonnets, bandeaux)",
      "Ceintures textiles",
    ],
  },
];

export default function ChoisirTypeVetementPage() {
  const [selected, setSelected] = useState<Category | null>(null);

  const modalItems = useMemo(() => selected?.items ?? [], [selected]);
  const modalTitle = useMemo(
    () => (selected ? selected.label.replace("\n", " ") : ""),
    [selected]
  );

  return (
    <div className="min-h-screen bg-[#f3f1f6] font-montserrat text-[#1e1b24]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-24 pt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#3c2a5d]">
          Etape 2 sur 5
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#dcd7e3]">
          <div className="h-full w-2/5 rounded-full bg-[#3c2a5d]" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-[#1e1b24]">
            Choisir un type de vêtement
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#3a3640]">
            Sélectionnez la catégorie de vêtement pour laquelle vous avez besoin
            d'une création sur mesure ou d'une retouche.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="relative">
              <button
                type="button"
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-white px-3 py-4 text-center shadow-sm transition hover:shadow-md"
              >
                <img
                  src={category.icon}
                  alt=""
                  className="h-14 w-14 object-contain"
                />
                <span className="whitespace-pre-line text-sm font-semibold text-[#1e1b24]">
                  {category.label}
                </span>
                <span className="sr-only">
                  Sélectionner {category.label}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelected(category)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#d6d1dd] text-xs font-semibold text-[#1e1b24]"
                aria-label={`Infos ${category.label.replace("\n", " ")}`}
              >
                i
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelected(null)}
            aria-label="Fermer la fenêtre"
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-white px-6 py-5 text-center shadow-xl">
            <h2 className="text-lg font-semibold">{modalTitle}</h2>
            <p className="mt-3 text-sm text-[#3a3640]">{selected.description}</p>
            <p className="mt-4 text-sm font-semibold text-[#1e1b24]">
              Articles inclus
            </p>
            <ul className="mt-3 space-y-1 text-sm text-[#1e1b24]">
              {modalItems.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full bg-[#3c2a5d] py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <BottomNavClientWrapper />
    </div>
  );
}
