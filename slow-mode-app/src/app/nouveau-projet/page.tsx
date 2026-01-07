"use client";

import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

export default function NouveauProjetPage() {
  return (
    <div className="min-h-screen bg-[#f3f1f6] font-montserrat text-[#1e1b24]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-24 pt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#3c2a5d]">
          Etape 1 sur 5
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#dcd7e3]">
          <div className="h-full w-1/5 rounded-full bg-[#3c2a5d]" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-[#1e1b24]">
            Nouveau projet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#3a3640]">
            Précisez votre besoin : souhaitez-vous créer une nouvelle pièce
            unique ou effectuer une retouche sur un vêtement existant ?
          </p>
        </div>

        <div className="relative mt-10 flex h-56 items-center justify-center">
          <img
            src="/icons/sweing.png"
            alt=""
            className="h-40 w-auto max-w-xs"
          />
          <img
            src="/icons/plus.png"
            alt=""
            className="absolute -left-1 bottom-1 h-20 w-20"
          />
          <img
            src="/icons/tape-measure.png"
            alt=""
            className="absolute -right-1 bottom-0 h-32 w-32"
          />
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <button
            type="button"
            className="rounded-full bg-[#3c2a5d] py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#34214f]"
          >
            Création
          </button>
          <button
            type="button"
            className="rounded-full bg-[#2f3d16] py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#273210]"
          >
            Retouche
          </button>
        </div>
      </div>

      <BottomNavClientWrapper />
    </div>
  );
}
