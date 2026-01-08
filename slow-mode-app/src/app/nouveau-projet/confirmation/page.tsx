"use client";

import Link from "next/link";

export default function ConfirmationProjetPage() {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-zinc-100 bg-white/80 p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-cyan-950/10">
          <img src="/icons/yes%20(1).png" alt="" className="h-12 w-12" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-cyan-950 font-lusitana">
          Projet confirme
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          Felicitations ! Votre projet est desormais entre les mains expertes de votre couturier.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          Vous recevrez une notification des qu'il aura valide la faisabilite de votre creation.
        </p>

        <Link
          href="/commandes"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-cyan-950 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-900"
        >
          OK
        </Link>
      </div>
    </div>
  );
}
