"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
      "Cette categorie couvre tout vetement s'enfilant par la tete ou se boutonnant sur le buste.",
    items: ["Chemises", "T-shirts", "Blouses", "Pulls", "Gilets", "Debardeurs"],
  },
  {
    id: "bottoms",
    label: "Bas",
    icon: "/icons/jeans.png",
    description: "Regroupe les pieces habillant la partie inferieure du corps.",
    items: ["Jupes", "Pantalons", "Jeans", "Shorts", "Bermudas"],
  },
  {
    id: "full-body",
    label: "Robes et\nCombinaisons",
    icon: "/icons/girl-dress.png",
    description: "Vetements d'une seule piece couvrant le haut et le bas du corps.",
    items: [
      "Robes de jour ou de soiree",
      "Combinaisons-pantalons",
      "Combi-shorts",
      "Salopettes",
    ],
  },
  {
    id: "outerwear",
    label: "Vetements\nd'exterieur",
    icon: "/icons/lab-coat.png",
    description:
      "Pieces structurees portees par-dessus d'autres vetements pour la protection ou le style.",
    items: ["Vestes", "Manteaux", "Blazers", "Parkas", "Trenchs", "Impermables"],
  },
  {
    id: "lingerie",
    label: "Lingerie, Bain\net Nuit",
    icon: "/icons/bathrobe.png",
    description:
      "Articles delicats ou techniques portes a meme le corps ou pour le repos.",
    items: [
      "Pyjamas",
      "Chemises de nuit",
      "Sous-vetements",
      "Maillots de bain",
      "Peignoirs",
    ],
  },
  {
    id: "accessories",
    label: "Accessoires et\nTextile Maison",
    icon: "/icons/scarf.png",
    description: "Tout ce qui complete une tenue ou concerne le linge de maison.",
    items: ["Echarpes", "Foulards", "Accessoires de tete", "Ceintures textiles"],
  },
];

export default function ChoisirTypeVetementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as "creation" | "retouche" | null;
  const [selected, setSelected] = useState<Category | null>(null);

  const modalItems = useMemo(() => selected?.items ?? [], [selected]);
  const modalTitle = useMemo(() => (selected ? selected.label.replace("\n", " ") : ""), [selected]);

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Etape 2 sur 5
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
          <div className="h-full w-2/5 rounded-full bg-cyan-950" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-lusitana text-cyan-950">Choisir un type de vetement</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Selectionnez la categorie de vetement pour laquelle vous avez besoin d'une creation sur
            mesure ou d'une retouche.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="relative">
              <button
                type="button"
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-100 bg-white px-3 py-4 text-center shadow-sm transition hover:border-cyan-950"
                onClick={() => {
                  const draft = JSON.parse(localStorage.getItem("projetDraft") || "{}");
                  localStorage.setItem(
                    "projetDraft",
                    JSON.stringify({ ...draft, categorie: category.id, mode: mode ?? draft.mode })
                  );
                  const modeParam = mode ? `&mode=${mode}` : "";
                  router.push(`/nouveau-projet/tissu?category=${category.id}${modeParam}`);
                }}
              >
                <img src={category.icon} alt="" className="h-14 w-14 object-contain" />
                <span className="whitespace-pre-line text-sm font-semibold text-zinc-900">
                  {category.label}
                </span>
                <span className="sr-only">Selectionner {category.label}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelected(category)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-xs font-semibold text-zinc-900"
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
            aria-label="Fermer la fenetre"
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-white px-6 py-5 text-center shadow-xl">
            <h2 className="text-lg font-semibold">{modalTitle}</h2>
            <p className="mt-3 text-sm text-zinc-600">{selected.description}</p>
            <p className="mt-4 text-sm font-semibold text-zinc-900">Articles inclus</p>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {modalItems.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full bg-cyan-950 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
