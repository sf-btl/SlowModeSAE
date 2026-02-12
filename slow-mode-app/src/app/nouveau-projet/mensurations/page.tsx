"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Field = {
  id: string;
  label: string;
};

const CATEGORY_FIELDS: Record<string, Field[]> = {
  tops: [
    { id: "taille", label: "Taille (hauteur totale) (cm)" },
    { id: "poitrine", label: "Tour de poitrine (cm)" },
    { id: "tailleTour", label: "Tour de taille (cm)" },
    { id: "epaules", label: "Largeur d'epaules (cm)" },
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
    { id: "epauleTaille", label: "Longueur epaule-taille (cm)" },
  ],
  outerwear: [
    { id: "taille", label: "Taille (hauteur totale) (cm)" },
    { id: "poitrine", label: "Tour de poitrine (avec aisance) (cm)" },
    { id: "epaules", label: "Largeur d'epaules (cm)" },
    { id: "biceps", label: "Tour de bras (biceps) (cm)" },
  ],
  lingerie: [
    { id: "dessousPoitrine", label: "Tour de dessous de poitrine (cm)" },
    { id: "poitrine", label: "Tour de poitrine (cm)" },
    { id: "bassin", label: "Tour de bassin (cm)" },
  ],
  accessories: [
    { id: "tete", label: "Tour de tete (bonnets/bandeaux) (cm)" },
    { id: "tailleTour", label: "Tour de taille (ceintures) (cm)" },
  ],
};

function MensurationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") ?? "tops";
  const [values, setValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fields = useMemo(() => CATEGORY_FIELDS[category] ?? CATEGORY_FIELDS.tops, [category]);

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Etape 5 sur 5
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
          <div className="h-full w-full rounded-full bg-cyan-950" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-lusitana text-cyan-950">
            Soumettre vos mensurations
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Prenez un moment pour renseigner vos mesures actuelles. Un vetement parfaitement
            ajuste dure plus longtemps et reduit les retours inutiles.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {fields.map((field) => (
            <label key={field.id} className="block text-sm text-zinc-700">
              {field.label}
              <input
                type="number"
                inputMode="decimal"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
                placeholder="0"
                value={values[field.id] ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [field.id]: event.target.value }))
                }
              />
            </label>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={async () => {
              const draft = JSON.parse(localStorage.getItem("projetDraft") || "{}");
              setErrorMessage(null);
              if (!draft.couturierId || !draft.mode) {
                setErrorMessage("Merci de selectionner un couturier et un type de projet.");
                return;
              }
              setIsSubmitting(true);
              try {
                const res = await fetch("/api/projet", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    mode: draft.mode,
                    categorie: draft.categorie ?? category,
                    couturierId: draft.couturierId,
                    tissuId: draft.tissuId ?? null,
                    description: draft.description ?? "",
                    images: draft.images ?? [],
                    mensurations: values,
                  }),
                });
                const json = await res.json();
                if (!json?.success) {
                  setErrorMessage(json?.message || "Erreur lors de l'envoi du projet.");
                  return;
                }
                localStorage.removeItem("projetDraft");
                router.push("/nouveau-projet/confirmation");
              } catch (error) {
                console.error("Creation projet erreur:", error);
                setErrorMessage("Erreur reseau lors de l'envoi.");
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="w-full rounded-full bg-cyan-950 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi..." : "Soumettre mon projet"}
          </button>
          {errorMessage && <p className="mt-3 text-center text-xs text-rose-600">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default function MensurationsPage() {
  return (
    <Suspense>
      <MensurationsContent />
    </Suspense>
  );
}
