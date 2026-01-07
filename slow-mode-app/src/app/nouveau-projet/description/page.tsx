"use client";

import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

export default function DescriptionProjetPage() {
  return (
    <div className="min-h-screen bg-[#f3f1f6] font-montserrat text-[#1e1b24]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 pb-24 pt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-[#3c2a5d]">
          Etape 4 sur 5
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#dcd7e3]">
          <div className="h-full w-4/5 rounded-full bg-[#3c2a5d]" />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold text-[#1e1b24]">
            Décrire votre projet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#3a3640]">
            Cette étape sera finalisée dans la prochaine itération.
          </p>
        </div>
      </div>

      <BottomNavClientWrapper />
    </div>
  );
}
