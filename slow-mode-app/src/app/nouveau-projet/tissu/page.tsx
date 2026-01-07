"use client";

import Link from "next/link";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

export default function ChoisirTissuPage() {
  return (
    <div className="min-h-screen bg-[#f3f1f6] font-montserrat text-[#1e1b24]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-24 pt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#3c2a5d]">
          Etape 3 sur 5
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#dcd7e3]">
          <div className="h-full w-3/5 rounded-full bg-[#3c2a5d]" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-[#1e1b24]">
            Choisir un tissu
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#3a3640]">
            Sélectionnez la matière première de votre création. Choisissez
            parmi les tissus disponibles sur la plateforme pour une expédition
            directe chez votre couturier, ou indiquez que vous fournirez votre
            propre tissu pour une personnalisation totale.
          </p>
        </div>

        <div className="relative mt-10 flex h-56 items-center justify-center">
          <img
            src="/icons/fabric%20(1).png"
            alt=""
            className="h-44 w-auto max-w-xs"
          />
          <img
            src="/icons/tape-measure.png"
            alt=""
            className="absolute -right-2 bottom-0 h-28 w-28"
          />
        </div>

        <div className="mt-12">
          <Link
            href="/marketplace?selection=1"
            className="block w-full rounded-full bg-[#3c2a5d] py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#34214f]"
          >
            Je choisis un tissu
          </Link>
        </div>
      </div>

      <BottomNavClientWrapper />
    </div>
  );
}
