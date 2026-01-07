"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Loader2, Info, Plus, Minus } from "lucide-react";
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
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formState, setFormState] = useState({ nom: "", prix: "0", stock: "0", categorie: "AUTRE" });

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
    fetchProduits();
  }, []);

  async function fetchProduits() {
    setProdLoading(true);
    try {
      const res = await fetch('/api/produit');
      const j = await res.json();
      if (j.success) setProduits(j.produits || []);
    } catch (e) {
      // ignore
    } finally { setProdLoading(false); }
  }

  async function advanceOrder(id: number) {
    try {
      await fetch(`/api/commandes/CMD-${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'advance' }) });
      // refresh
      const res = await fetch('/api/commandes');
      const j = await res.json(); if (j.success) setCommandes(j.commandes);
    } catch (e) { console.error(e); }
  }

  async function updateStock(produitId: number, delta: number) {
    try {
      const res = await fetch('/api/produit/stock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ produitId, delta }) });
      const j = await res.json();
      if (j.success) {
        setProduits((prev) => prev.map(p => p.id === produitId ? { ...p, stock: j.produit.stock } : p));
      }
    } catch (e) { console.error(e); }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('nom', formState.nom);
      fd.append('prix', formState.prix);
      fd.append('stock', formState.stock);
      fd.append('categorie', formState.categorie);
      const res = await fetch('/api/produit', { method: 'POST', body: fd });
      const j = await res.json();
      if (j.success) {
        setFormState({ nom: '', prix: '0', stock: '0', categorie: 'AUTRE' });
        setShowAddForm(false);
        fetchProduits();
      } else {
        alert(j.message || 'Erreur');
      }
    } catch (err) {
      console.error(err);
    }
  }

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
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => advanceOrder(commande.id)} className="text-xs px-2 py-1 rounded bg-[#4b2d52] text-white">
                        Avancer statut
                      </button>
                      <Link href={`/commandes/${commande.id}`} className="text-xs text-cyan-800 hover:underline">
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-gray-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-[#4b2d52]" />
            <h2 className="text-sm font-bold text-gray-900">Produits</h2>
            <div className="ml-auto">
              <button onClick={() => setShowAddForm(s => !s)} className="text-sm px-2 py-1 rounded border">{showAddForm ? 'Annuler' : 'Ajouter un produit'}</button>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddProduct} className="space-y-2 mb-4">
              <input placeholder="Nom" value={formState.nom} onChange={(e) => setFormState(s => ({ ...s, nom: e.target.value }))} className="w-full p-2 border rounded" />
              <div className="flex gap-2">
                <input placeholder="Prix" value={formState.prix} onChange={(e) => setFormState(s => ({ ...s, prix: e.target.value }))} className="p-2 border rounded flex-1" />
                <input placeholder="Stock" value={formState.stock} onChange={(e) => setFormState(s => ({ ...s, stock: e.target.value }))} className="p-2 border rounded w-28" />
              </div>
              <div className="flex gap-2 items-center">
                <select value={formState.categorie} onChange={(e) => setFormState(s => ({ ...s, categorie: e.target.value }))} className="p-2 border rounded">
                  <option value="AUTRE">AUTRE</option>
                  <option value="CHEMISE">CHEMISE</option>
                  <option value="T_SHIRT">T_SHIRT</option>
                </select>
                <button className="px-3 py-2 bg-[#4b2d52] text-white rounded">Créer</button>
              </div>
            </form>
          )}

          {prodLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin h-5 w-5 text-gray-400" /></div>
          ) : produits.length === 0 ? (
            <div className="text-sm text-gray-500">Aucun produit trouvé.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {produits.map(p => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{p.nom}</div>
                    <div className="text-xs text-gray-600">{p.prix} € — Stock: {p.stock}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateStock(p.id, -1)} className="p-1 rounded bg-gray-100"><Minus className="h-4 w-4" /></button>
                    <button onClick={() => updateStock(p.id, 1)} className="p-1 rounded bg-gray-100"><Plus className="h-4 w-4" /></button>
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
