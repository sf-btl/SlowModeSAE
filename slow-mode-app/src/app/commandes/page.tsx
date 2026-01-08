"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CommandeItem = {
  id: number;
  code: string;
  statut: string;
  progress: number;
};

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<CommandeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/commandes", { cache: "no-store" });
        const json = await res.json();
        if (json?.success) {
          setCommandes(json.commandes);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Suivi</p>
        <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">Mes commandes</h1>
      </div>

      <div className="rounded-3xl border border-zinc-100 bg-white/80 shadow-sm">
        {loading && (
          <div className="px-6 py-6 text-sm text-zinc-500">Chargement...</div>
        )}
        {!loading && commandes.length === 0 && (
          <div className="px-6 py-6 text-sm text-zinc-500">
            Aucune commande pour le moment.
          </div>
        )}
        {commandes.map((order) => (
          <Link
            key={order.id}
            href={`/commandes/${order.id}`}
            className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 last:border-b-0"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-900">{order.code}</p>
              <p className="mt-1 text-xs text-zinc-500">Progression</p>
              <div className="mt-2 h-2 w-full rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-cyan-950"
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>
            <span className="ml-4 text-xl text-zinc-700">{">"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
