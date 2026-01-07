"use client";

import Link from "next/link";

export default function ConfirmationProjetPage() {
  return (
    <div className="min-h-screen bg-[#3c2a5d] font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 pb-20 pt-10 text-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg">
          <img
            src="/icons/yes%20(1).png"
            alt=""
            className="h-14 w-14"
          />
        </div>

        <h1 className="mt-8 text-2xl font-semibold">Projet confirmé</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/90">
          Félicitations ! Votre projet est désormais entre les mains expertes
          de votre couturier.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/90">
          Vous recevrez une notification dès qu'il aura validé la faisabilité
          de votre création.
        </p>

        <Link
          href="/commandes"
          className="mt-10 w-full rounded-full bg-white py-3 text-center text-sm font-semibold text-[#3c2a5d] shadow-sm transition hover:bg-white/90"
        >
          OK
        </Link>
      </div>
    </div>
  );
}
