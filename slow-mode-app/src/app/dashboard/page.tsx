"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";

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
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formState, setFormState] = useState({
    nom: "",
    prix: "0",
    stock: "0",
    categorie: "AUTRE",
  });

  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/commandes");
        const json = await res.json();
        if (json.success) {
          setCommandes(json.commandes);
        }
      } catch {
        // ignore
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
      const res = await fetch("/api/produit");
      const j = await res.json();
      if (j.success) setProduits(j.produits || []);
    } catch {
      // ignore
    } finally {
      setProdLoading(false);
    }
  }

  async function advanceOrder(id: number) {
    try {
      await fetch(`/api/commandes/CMD-${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "advance" }),
      });
      const res = await fetch("/api/commandes");
      const j = await res.json();
      if (j.success) setCommandes(j.commandes);
    } catch (e) {
      console.error(e);
    }
  }

  async function updateStock(produitId: number, delta: number) {
    try {
      const res = await fetch("/api/produit/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produitId, delta }),
      });
      const j = await res.json();
      if (j.success) {
        setProduits((prev) =>
          prev.map((p) => (p.id === produitId ? { ...p, stock: j.produit.stock } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("nom", formState.nom);
      fd.append("prix", formState.prix);
      fd.append("stock", formState.stock);
      fd.append("categorie", formState.categorie);
      const res = await fetch("/api/produit", { method: "POST", body: fd });
      const j = await res.json();
      if (j.success) {
        setFormState({ nom: "", prix: "0", stock: "0", categorie: "AUTRE" });
        setShowAddForm(false);
        fetchProduits();
      } else {
        alert(j.message || "Erreur");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-montserrat uppercase tracking-[0.3em] text-zinc-500">
          Espace createur
        </p>
        <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">Dashboard</h1>
      </div>

      <main className="space-y-6">
        <section className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-cyan-950" />
            <h2 className="text-sm font-semibold text-zinc-900">Commandes en cours</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-zinc-400" />
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              <Info className="mx-auto mb-2 h-6 w-6" />
              <span className="text-sm font-semibold text-zinc-900">
                Aucune commande en cours.
              </span>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {commandes.map((commande) => (
                <li
                  key={commande.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-semibold text-zinc-900">Commande #{commande.id}</div>
                    <div className="text-xs text-zinc-600">
                      {commande.date_commande &&
                        new Date(commande.date_commande).toLocaleDateString()}{" "}
                      - Statut : {commande.statut}
                    </div>
                    {commande.acheteur?.utilisateur && (
                      <div className="text-xs text-zinc-600 mt-1">
                        Client : {commande.acheteur.utilisateur.prenom}{" "}
                        {commande.acheteur.utilisateur.nom} (
                        {commande.acheteur.utilisateur.email})
                      </div>
                    )}
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <div className="text-sm font-semibold text-cyan-950">
                      {commande.montant_total.toFixed(2)} €
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => advanceOrder(commande.id)}
                        className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-white"
                      >
                        Avancer statut
                      </button>
                      <Link
                        href={`/commandes/${commande.id}`}
                        className="text-xs text-cyan-950 hover:underline"
                      >
                        Voir details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-cyan-950" />
            <h2 className="text-sm font-semibold text-zinc-900">Produits</h2>
            <div className="ml-auto">
              <button
                onClick={() => setShowAddForm((s) => !s)}
                className="text-sm px-3 py-1 rounded-full border border-zinc-200 text-zinc-700"
              >
                {showAddForm ? "Annuler" : "Ajouter un produit"}
              </button>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddProduct} className="space-y-3 mb-4">
              <input
                placeholder="Nom"
                value={formState.nom}
                onChange={(e) => setFormState((s) => ({ ...s, nom: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Prix"
                  value={formState.prix}
                  onChange={(e) => setFormState((s) => ({ ...s, prix: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20 sm:flex-1"
                />
                <input
                  placeholder="Stock"
                  value={formState.stock}
                  onChange={(e) => setFormState((s) => ({ ...s, stock: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20 sm:w-32"
                />
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={formState.categorie}
                  onChange={(e) => setFormState((s) => ({ ...s, categorie: e.target.value }))}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
                >
                  <option value="AUTRE">AUTRE</option>
                  <option value="CHEMISE">CHEMISE</option>
                  <option value="T_SHIRT">T_SHIRT</option>
                </select>
                <button className="px-4 py-2 rounded-full bg-cyan-950 text-white text-sm">
                  Creer
                </button>
              </div>
            </form>
          )}

          {prodLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-5 w-5 text-zinc-400" />
            </div>
          ) : produits.length === 0 ? (
            <div className="text-sm text-zinc-500">Aucun produit trouve.</div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {produits.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-zinc-900">{p.nom}</div>
                    <div className="text-xs text-zinc-600">
                      {p.prix} € - Stock: {p.stock}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStock(p.id, -1)}
                      className="p-2 rounded-full bg-zinc-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateStock(p.id, 1)}
                      className="p-2 rounded-full bg-zinc-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
