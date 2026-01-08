"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NouveauProjetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couturierId = searchParams.get("couturierId");

  useEffect(() => {
    if (!couturierId) return;
    const draft = JSON.parse(localStorage.getItem("projetDraft") || "{}");
    localStorage.setItem("projetDraft", JSON.stringify({ ...draft, couturierId: Number(couturierId) }));
  }, [couturierId]);

  const handleMode = (mode: "creation" | "retouche") => {
    const draft = JSON.parse(localStorage.getItem("projetDraft") || "{}");
    localStorage.setItem("projetDraft", JSON.stringify({ ...draft, mode }));
    router.push(`/nouveau-projet/type?mode=${mode}`);
  };

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Etape 1 sur 5
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
          <div className="h-full w-1/5 rounded-full bg-cyan-950" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-lusitana text-cyan-950">Nouveau projet</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Precisez votre besoin : souhaitez-vous creer une nouvelle piece unique ou effectuer une
            retouche sur un vetement existant ?
          </p>
        </div>

        <div className="relative mt-8 flex h-56 items-center justify-center">
          <img src="/icons/sweing.png" alt="" className="h-40 w-auto max-w-xs" />
          <img src="/icons/plus.png" alt="" className="absolute -left-1 bottom-1 h-20 w-20" />
          <img src="/icons/tape-measure.png" alt="" className="absolute -right-1 bottom-0 h-32 w-32" />
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => handleMode("creation")}
            className="rounded-full bg-cyan-950 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900"
          >
            Creation
          </button>
          <button
            type="button"
            onClick={() => handleMode("retouche")}
            className="rounded-full border border-zinc-200 bg-white py-3 text-center text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-cyan-950 hover:text-cyan-950"
          >
            Retouche
          </button>
        </div>
      </div>
    </div>
  );
}
