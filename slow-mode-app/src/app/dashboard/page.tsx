"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
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
  const [tissus, setTissus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(false);
  const [tissuLoading, setTissuLoading] = useState(false);
  
  const [formState, setFormState] = useState({ nom: "", prix: "0", stock: "0", categorie: "AUTRE" });
  const [prices, setPrices] = useState<any[]>([]);
  const [priceForm, setPriceForm] = useState({ typeProjet: "CREATION", categorie: "", prix: "0" });
  const [selectedType, setSelectedType] = useState<string | null>("CREATION");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [stats, setStats] = useState<{ total_received: number; count_received: number; total_pending: number } | null>(null);

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
    fetchTissus();
    fetchStats();
    fetchPrices();
  }, []);

  async function fetchPrices() {
    try {
      const res = await fetch('/api/couturier/prices');
      const j = await res.json();
      if (j.success) setPrices(j.prices || []);
    } catch (e) { /* ignore */ }
  }

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

  async function fetchTissus() {
    setTissuLoading(true);
    try {
      const res = await fetch('/api/tissu');
      const j = await res.json();
      if (j.success) setTissus(j.tissus || []);
    } catch (e) {
      // ignore
    } finally { setTissuLoading(false); }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/dashboard-stats');
      const j = await res.json();
      if (j.success) setStats(j.stats);
    } catch (e) { console.error(e); }
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

  async function updateMetrage(tissuId: number, delta: number) {
    try {
      const res = await fetch('/api/tissu/stock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tissuId, delta }) });
      const j = await res.json();
      if (j.success) setTissus(prev => prev.map(t => t.id === tissuId ? { ...t, metrage_dispo: j.tissu.metrage_dispo } : t));
    } catch (e) { console.error(e); }
  }

  // Product creation handled on dedicated page `/produit`

  

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
            <h2 className="text-sm font-semibold text-zinc-900">Finances</h2>
            <div className="ml-auto text-sm text-zinc-700">
              Reçu: {stats ? (stats.total_received || 0).toFixed(2) : '0.00'} €
            </div>
          </div>
          <div className="text-sm text-zinc-600">Commandes finalisées: {stats?.count_received ?? 0}</div>
          <div className="text-sm text-zinc-600 mt-2">En attente: {(stats?.total_pending ?? 0).toFixed(2)} €</div>
        </section>

        {/* Affiche Produits pour couturier, Tissus pour fournisseur */}
        {user?.accountType === 'couturier' && (
          <section className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-cyan-950" />
              <h2 className="text-sm font-semibold text-zinc-900">Produits</h2>
              <div className="ml-auto">
                <Link href="/produit" className="text-sm px-3 py-1 rounded-full border border-zinc-200 text-zinc-700">Ajouter un produit</Link>
              </div>
            </div>

            {/* Création de produit via la page dédiée `/produit` */}

            {prodLoading ? (<div className="flex justify-center py-6"><Loader2 className="animate-spin h-5 w-5" /></div>) : produits.length === 0 ? (<div className="text-sm text-zinc-500">Aucun produit trouve.</div>) : (
              <ul className="divide-y divide-zinc-100">
                {produits.map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{p.nom}</div>
                      <div className="text-xs text-zinc-600">{p.prix} € - Stock: {p.stock}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateStock(p.id, -1)} className="p-2 rounded-full bg-zinc-100"><Minus className="h-4 w-4" /></button>
                      <button onClick={() => updateStock(p.id, 1)} className="p-2 rounded-full bg-zinc-100"><Plus className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {user?.accountType === 'couturier' && (
          <section className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-zinc-900">Prix personnalisés</h2>
            </div>

            <div className="mb-6">
              <div className="text-xs text-zinc-600 mb-2">Type de projet</div>
              <div className="grid grid-cols-2 gap-3">
                {['CREATION', 'RETOUCHE'].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSelectedType(t); setPriceForm(prev => ({ ...prev, typeProjet: t })); }}
                    className={`rounded-xl border px-4 py-3 text-sm text-left ${selectedType === t ? 'border-cyan-950 bg-cyan-50' : 'border-zinc-100 bg-white'}`}>
                    <div className="font-semibold">{t === 'CREATION' ? 'Création' : 'Retouche'}</div>
                    <div className="text-xs text-zinc-600 mt-1">Configurer les prix par type</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-zinc-600 mb-2">Catégorie</div>
              <div className="grid grid-cols-3 gap-3">
                {['', 'TOPS', 'BOTTOMS', 'FULL_BODY', 'OUTERWEAR', 'LINGERIE', 'ACCESSORIES'].map((c) => (
                  <button
                    key={c || 'ALL'}
                    onClick={() => {
                      setSelectedCategory(c);
                      setPriceForm(prev => ({ ...prev, categorie: c }));
                    }}
                    className={`rounded-xl border px-3 py-2 text-sm text-center ${selectedCategory === c ? 'border-cyan-950 bg-cyan-50' : 'border-zinc-100 bg-white'}`}>
                    <div className="font-semibold">{c === '' ? 'Toutes' : (c === 'FULL_BODY' ? 'Full body' : c.charAt(0) + c.slice(1).toLowerCase())}</div>
                    {c !== '' && <div className="text-xs text-zinc-600 mt-1">{c === 'FULL_BODY' ? 'Full body' : c.toLowerCase()}</div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-zinc-600">Prix (€)</label>
              <input type="number" step="0.01" value={priceForm.prix} onChange={(e) => setPriceForm(prev => ({ ...prev, prix: e.target.value }))} className="mt-1 rounded-md border px-3 py-2 w-40" />
            </div>

            <div className="mb-6">
              <button onClick={async () => {
                const payload = { typeProjet: priceForm.typeProjet, categorie: priceForm.categorie || null, prix: Number(priceForm.prix) };
                try {
                  const res = await fetch('/api/couturier/prices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                  const j = await res.json();
                  if (j.success) {
                    setPriceForm({ typeProjet: 'CREATION', categorie: '', prix: '0' });
                    fetchPrices();
                  } else {
                    console.error('Save price error', j);
                  }
                } catch (e) { console.error(e); }
              }} className="rounded-full bg-cyan-950 text-white px-4 py-2">Enregistrer le prix</button>
            </div>

            <div>
              {(!prices || prices.length === 0) ? <div className="text-sm text-zinc-500">Aucun prix configuré.</div> : (
                <ul className="divide-y divide-zinc-100">
                  {prices
                    .filter(p => (!selectedType || p.typeProjet === selectedType) && (!selectedCategory || selectedCategory === '' || p.categorie === selectedCategory))
                    .map(pr => (
                    <li key={pr.id} className="py-2 flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-semibold">{pr.typeProjet} {pr.categorie ? `— ${pr.categorie}` : ''}</div>
                        <div className="text-xs text-zinc-600">{Number(pr.prix).toFixed(2)} €</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {user?.accountType === 'fournisseur' && (
          <section className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-zinc-900">Tissus</h2>
              <div className="ml-auto">
                <Link href="/tissu" className="text-sm px-3 py-1 rounded-full border border-zinc-200 text-zinc-700">Ajouter tissu</Link>
              </div>
            </div>

            {tissuLoading ? (<div className="flex justify-center py-6"><Loader2 className="animate-spin h-5 w-5" /></div>) : tissus.length === 0 ? (<div className="text-sm text-zinc-500">Aucun tissu trouve.</div>) : (
              <ul className="divide-y divide-zinc-100">
                {tissus.map(t => (
                  <li key={t.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{t.matiere} — {t.couleur}</div>
                      <div className="text-xs text-zinc-600">{t.grammage} g — Metrage dispo: {t.metrage_dispo} m — {t.prix_unitaire} €</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateMetrage(t.id, -1)} className="p-2 rounded-full bg-zinc-100">-</button>
                      <button onClick={() => updateMetrage(t.id, 1)} className="p-2 rounded-full bg-zinc-100">+</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Produits affichés par rôle (couturier) — section globale supprimée pour éviter duplication */}
      </main>
    </div>
  );
}
