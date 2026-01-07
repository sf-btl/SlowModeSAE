"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

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
    <div className="min-h-screen bg-white pb-24 font-montserrat text-[#1e1b24]">
      <div className="mx-auto w-full max-w-md px-5 pt-8">
        <h1 className="text-xl font-semibold">Mes commandes</h1>
      </div>

      <div className="mt-6 border-t border-gray-200">
        {loading && (
          <div className="px-5 py-6 text-sm text-gray-500">Chargement...</div>
        )}
        {!loading && commandes.length === 0 && (
          <div className="px-5 py-6 text-sm text-gray-500">
            Aucune commande pour le moment.
          </div>
        )}
        {commandes.map((order) => (
          <Link
            key={order.id}
            href={`/commandes/${order.id}`}
            className="flex items-center justify-between border-b border-gray-200 px-5 py-4"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1e1b24]">
                {order.code}
              </p>
              <p className="mt-1 text-xs text-gray-600">Progression</p>
              <div className="mt-2 h-2 w-full rounded-full bg-[#d7d4dc]">
                <div
                  className="h-full rounded-full bg-[#3c2a5d]"
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>
            <span className="ml-4 text-xl text-[#1e1b24]">›</span>
          </Link>
        ))}
      </div>

      <BottomNavClientWrapper />
    </div>
  );
}
