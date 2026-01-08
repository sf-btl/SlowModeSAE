"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Heart, Package } from "lucide-react";

interface Tissu {
  id: number;
  matiere: string;
  grammage: number | null;
  couleur: string;
  metrage_dispo: number;
  prix_unitaire: number;
  imagePath: string;
  fournisseur: {
    nom_societe: string;
    utilisateur: {
      nom: string;
      prenom: string;
    };
  };
}

interface Product {
  id: number;
  nom_produit: string;
  categorie: string;
  description: string | null;
  imagePath: string | null;
  prix_unitaire: number;
  stock: number;
  couturier: {
    utilisateur: {
      nom: string;
      prenom: string;
      ville: string | null;
    };
  };
}

const categories = [
  { label: "Tout", value: "ALL" },
  { label: "Pantalon", value: "PANTALON" },
  { label: "Chemise", value: "CHEMISE" },
  { label: "Robe", value: "ROBE" },
  { label: "Veste", value: "VESTE" },
  { label: "Pull", value: "PULL" },
  { label: "T-shirt", value: "T_SHIRT" },
  { label: "Jupe", value: "JUPE" },
  { label: "Manteau", value: "MANTEAU" },
  { label: "Combinaison", value: "COMBINAISON" },
  { label: "Accessoire", value: "ACCESSOIRE" },
  { label: "Autre", value: "AUTRE" },
];

const categoryLabelFromValue = (value: string) => {
  const match = categories.find((item) => item.value === value);
  return match ? match.label : "Produit";
};

const formatPriceEUR = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);

export default function FeedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectionMode = searchParams.get("selection") === "1";
  const categoryParam = searchParams.get("category");
  const [activeTab, setActiveTab] = useState<"patrons" | "tissus">(
    selectionMode ? "tissus" : "patrons"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [tissus, setTissus] = useState<Tissu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (selectionMode) {
      setActiveTab("tissus");
      setSelectedCategory(categories[0]);
      setIsDropdownOpen(false);
    }
  }, [selectionMode]);

  useEffect(() => {
    if (!selectionMode && categoryParam) {
      const normalizedParam = categoryParam.toUpperCase();
      const match = categories.find((item) => item.value === normalizedParam);
      if (match) {
        setSelectedCategory(match);
      }
    }
  }, [categoryParam, selectionMode]);

  useEffect(() => {
    if (activeTab === "patrons") {
      fetchProducts();
    } else {
      fetchTissus();
    }
  }, [selectedCategory, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products/feed");
      const data = await response.json();

      if (data.success) {
        let filteredProducts = data.products;

        if (selectedCategory.value !== "ALL") {
          filteredProducts = data.products.filter(
            (product: Product) => product.categorie === selectedCategory.value
          );
        }

        setProducts(filteredProducts);
      } else {
        setError(data.message || "Erreur lors du chargement des produits");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Impossible de charger les produits");
    } finally {
      setLoading(false);
    }
  };

  const fetchTissus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tissus/feed");
      const data = await response.json();

      if (data.success) {
        setTissus(data.tissus);
      } else {
        setError(data.message || "Erreur lors du chargement des tissus");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Impossible de charger les tissus");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-950 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-600 font-montserrat">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <p className="text-rose-600 font-montserrat mb-4">{error}</p>
          <button
            onClick={() => (activeTab === "patrons" ? fetchProducts() : fetchTissus())}
            className="bg-cyan-950 text-white px-6 py-2 rounded-xl font-montserrat"
          >
            Reessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        {selectionMode ? (
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600"
            onClick={() => router.push("/nouveau-projet/tissu")}
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        ) : (
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Marketplace</p>
        )}
        <h1 className="text-3xl font-lusitana text-cyan-950">
          {selectionMode ? "Choisir un tissu" : "Marketplace"}
        </h1>
        {!selectionMode && (
          <p className="text-sm text-zinc-600">
            Parcourez les patrons et les tissus pour vos projets responsables.
          </p>
        )}
      </div>

      {!selectionMode && (
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-2 bg-white rounded-2xl border border-zinc-100 p-2">
            <button
              onClick={() => setActiveTab("patrons")}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all font-montserrat flex-1 ${
                activeTab === "patrons"
                  ? "bg-cyan-950 text-white"
                  : "bg-transparent text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <Package size={18} />
              Patrons
            </button>
            <button
              onClick={() => setActiveTab("tissus")}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all font-montserrat flex-1 ${
                activeTab === "tissus"
                  ? "bg-cyan-950 text-white"
                  : "bg-transparent text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
              </svg>
              Tissus
            </button>
          </div>
        </div>
      )}

      {activeTab === "patrons" && !selectionMode && (
        <div className="max-w-5xl mx-auto px-4 pb-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full max-w-xs bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:border-cyan-950 transition-colors"
            >
              <span className="text-zinc-900 font-montserrat">{selectedCategory.label}</span>
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-full max-w-xs bg-white border border-zinc-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 font-montserrat transition-colors ${
                        selectedCategory.value === category.value
                          ? "bg-zinc-100 text-zinc-900 font-semibold"
                          : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "patrons" && !selectionMode && (
        <div className="max-w-5xl mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 font-montserrat">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => {
                const creatorName = `${product.couturier.utilisateur.prenom} ${product.couturier.utilisateur.nom}`.trim();
                const stockLabel =
                  product.stock === 0
                    ? "Rupture de stock"
                    : product.stock < 5
                    ? `Plus que ${product.stock} !`
                    : "Disponible";
                return (
                  <article key={product.id} className="group">
                    <div
                      className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm"
                      onClick={() => (window.location.href = `/produit/${product.id}`)}
                      role="button"
                      tabIndex={0}
                    >
                      {product.imagePath ? (
                        <img
                          src={product.imagePath}
                          alt={product.nom_produit}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-400">
                          <span className="font-montserrat text-sm">Pas d'image</span>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs text-zinc-700 shadow">
                        <Heart size={14} />
                        <span>{Math.max(product.stock, 0)}</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-zinc-500 font-montserrat">
                        {creatorName || "Atelier SlowMode"}
                      </p>
                      <p className="text-xs text-zinc-400 font-montserrat">{stockLabel}</p>
                      <p className="text-xs text-zinc-400 font-montserrat">
                        {categoryLabelFromValue(product.categorie)}
                      </p>
                      <h3 className="text-sm font-semibold text-zinc-900 font-montserrat truncate">
                        {product.nom_produit}
                      </h3>
                      <p className="text-sm font-semibold text-cyan-950">
                        {formatPriceEUR(product.prix_unitaire)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "tissus" && (
        <div className="max-w-5xl mx-auto px-4">
          {tissus.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 font-montserrat">Aucun tissu disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {tissus.map((tissu) => {
                const tissuHref = selectionMode
                  ? `/tissu/${tissu.id}?selection=1${categoryParam ? `&category=${categoryParam}` : ""}`
                  : `/tissu/${tissu.id}`;
                const metrageLabel =
                  tissu.metrage_dispo < 10 && tissu.metrage_dispo > 0
                    ? `Plus que ${tissu.metrage_dispo}m`
                    : "Disponible";
                return (
                  <article key={tissu.id} className="group">
                    <div
                      className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm"
                      onClick={() => (window.location.href = tissuHref)}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={tissu.imagePath}
                        alt={`${tissu.matiere} ${tissu.couleur}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs text-zinc-700 shadow">
                        <Heart size={14} />
                        <span>{Math.max(Math.round(tissu.metrage_dispo), 0)}</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-zinc-500 font-montserrat">{tissu.fournisseur.nom_societe}</p>
                      <p className="text-xs text-zinc-400 font-montserrat">{metrageLabel}</p>
                      <h3 className="text-sm font-semibold text-zinc-900 font-montserrat truncate">
                        {tissu.matiere} {tissu.couleur}
                      </h3>
                      <p className="text-sm font-semibold text-cyan-950">
                        {formatPriceEUR(tissu.prix_unitaire)} / m
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
