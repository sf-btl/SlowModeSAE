"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ChoisirTissuPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Etape 3 sur 5
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
          <div className="h-full w-3/5 rounded-full bg-cyan-950" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-lusitana text-cyan-950">Choisir un tissu</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Selectionnez la matiere premiere de votre creation. Choisissez parmi les tissus
            disponibles sur la plateforme pour une expedition directe chez votre couturier, ou
            indiquez que vous fournirez votre propre tissu.
          </p>
        </div>

        <div className="relative mt-8 flex h-56 items-center justify-center">
          <img src="/icons/fabric%20(1).png" alt="" className="h-44 w-auto max-w-xs" />
          <img src="/icons/tape-measure.png" alt="" className="absolute -right-2 bottom-0 h-28 w-28" />
        </div>

        <div className="mt-8">
          <Link
            href={`/marketplace?selection=1${category ? `&category=${category}` : ""}`}
            className="block w-full rounded-full bg-cyan-950 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900"
          >
            Je choisis un tissu
          </Link>
        </div>
      </div>
    </div>
  );
}
