"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Loader2, Info } from "lucide-react";
import Header from "@/components/Header";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";
import { useAuth } from "@/components/AuthProvider";

interface Commande {
  id: number;
  date_commande: string;
  statut: string;
  montant_total: number;
  acheteur?: {
    utilisateur?: {
      nom: string;
      prenom: string;
      email: string;
    };
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/commandes");
        const json = await res.json();
        if (json.success) {
          setCommandes(json.commandes);
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchCommandes();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
       <Header title="Dashboard" />
      <main className="mx-auto w-full max-w-2xl px-4 space-y-6">
        <section className="rounded-2xl bg-gray-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-[#4b2d52]" />
            <h2 className="text-sm font-bold text-gray-900">Commandes en cours</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Info className="mx-auto mb-2 h-6 w-6" />
              <span className="text-sm font-semibold text-gray-900">Aucune commande en cours.</span>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {commandes.map((commande) => (
                <li key={commande.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-bold text-gray-900">
                      Commande #{commande.id}
                    </div>
                    <div className="text-xs text-gray-600">
                      {commande.date_commande && new Date(commande.date_commande).toLocaleDateString()} - Statut : {commande.statut}
                    </div>
                    {commande.acheteur?.utilisateur && (
                      <div className="text-xs text-gray-700 mt-1">
                        Client : {commande.acheteur.utilisateur.prenom} {commande.acheteur.utilisateur.nom} ({commande.acheteur.utilisateur.email})
                      </div>
                    )}
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <div className="text-sm font-bold text-[#4b2d52]">
                      {commande.montant_total.toFixed(2)} €
                    </div>
                    <Link href={`/commandes/${commande.id}`} className="text-xs text-cyan-800 hover:underline">
                      Voir détails
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <BottomNavClientWrapper />
    </div>
  );
}
