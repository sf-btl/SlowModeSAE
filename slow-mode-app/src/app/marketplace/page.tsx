'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Heart, ShoppingCart, Search, Home, User, Package } from 'lucide-react';

// Types basés sur votre schéma Prisma
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

// Fonction pour détecter la catégorie depuis le nom du produit
const detectCategory = (nomProduit: string): string => {
  const nom = nomProduit.toLowerCase();
  if (nom.includes('pantalon')) return 'Pantalon';
  if (nom.includes('chemise')) return 'Chemise';
  if (nom.includes('robe')) return 'Robe';
  if (nom.includes('veste')) return 'Veste';
  return 'Produit';
};

export default function FeedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectionMode = searchParams.get('selection') === '1';
  const [activeTab, setActiveTab] = useState<'patrons' | 'tissus'>(
    selectionMode ? 'tissus' : 'patrons'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [tissus, setTissus] = useState<Tissu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['Tout', 'Pantalon', 'Chemise', 'Robe', 'Veste'];

  useEffect(() => {
    if (selectionMode) {
      setActiveTab('tissus');
      setSelectedCategory('Tout');
      setIsDropdownOpen(false);
    }
  }, [selectionMode]);

  useEffect(() => {
    if (activeTab === 'patrons') {
      fetchProducts();
    } else {
      fetchTissus();
    }
  }, [selectedCategory, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/feed');
      const data = await response.json();

      if (data.success) {
        let filteredProducts = data.products;
        
        if (selectedCategory !== 'Tout') {
          filteredProducts = data.products.filter((product: Product) => {
            const detectedCategory = detectCategory(product.nom_produit);
            return detectedCategory === selectedCategory;
          });
        }
        
        setProducts(filteredProducts);
      } else {
        setError(data.message || 'Erreur lors du chargement des produits');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchTissus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tissus/feed');
      const data = await response.json();

      if (data.success) {
        setTissus(data.tissus);
      } else {
        setError(data.message || 'Erreur lors du chargement des tissus');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les tissus');
    } finally {
      setLoading(false);
    }
  };

  const getCreatorInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-950 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-montserrat">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <p className="text-red-600 font-montserrat mb-4">{error}</p>
          <button
            onClick={() => activeTab === 'patrons' ? fetchProducts() : fetchTissus()}
            className="bg-cyan-950 text-white px-6 py-2 rounded-xl font-montserrat"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {selectionMode ? (
            <>
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"
                onClick={() => router.push('/nouveau-projet/tissu')}
              >
                <ArrowLeft size={18} />
                Retour
              </button>
              <h1 className="text-lg font-semibold text-gray-900 font-lusitana">
                Choisir un tissu
              </h1>
              <span className="w-10" aria-hidden="true" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 font-lusitana">SlowMode</h1>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart size={24} className="text-gray-700" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Search size={24} className="text-gray-700" />
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Tabs Patrons / Tissus */}
      {!selectionMode && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 bg-white">
            <button
              onClick={() => setActiveTab('patrons')}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all font-montserrat flex-1 ${
                activeTab === 'patrons'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package size={18} />
              Patrons
            </button>
            <button
              onClick={() => setActiveTab('tissus')}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all font-montserrat flex-1 ${
                activeTab === 'tissus'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
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

      {/* Filtre de catégories - Seulement pour Patrons */}
      {activeTab === 'patrons' && !selectionMode && (
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full max-w-xs bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <span className="text-gray-900 font-montserrat">{selectedCategory}</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                <div className="absolute top-full left-0 mt-1 w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 font-montserrat transition-colors ${
                        selectedCategory === category
                          ? 'bg-gray-100 text-gray-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Feed Patrons */}
      {activeTab === 'patrons' && !selectionMode && (
        <div className="max-w-4xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-montserrat">Aucun produit disponible</p>
            </div>
          ) : (
            products.map((product) => (
              <article key={product.id} className="bg-white mb-6">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mx-4">
                  <div 
                    className="relative w-full aspect-[4/5] bg-gray-50 cursor-pointer overflow-hidden"
                    onClick={() => window.location.href = `/produit/${product.id}`}
                  >
                    <button 
                      className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Heart size={20} className="text-gray-700" />
                    </button>

                    {product.imagePath ? (
                      <img
                        src={product.imagePath}
                        alt={product.nom_produit}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="font-montserrat">Pas d'image</span>
                      </div>
                    )}

                    {product.stock < 5 && product.stock > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Plus que {product.stock} !
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Rupture de stock
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 font-montserrat mb-1">
                      {detectCategory(product.nom_produit)}
                    </p>

                    <div className="flex items-start justify-between mb-3">
                      <h2 
                        className="text-xl font-bold text-gray-900 font-lusitana cursor-pointer hover:text-cyan-950 transition-colors flex-1"
                        onClick={() => window.location.href = `/produit/${product.id}`}
                      >
                        {product.nom_produit}
                      </h2>
                      <div className="text-xl font-bold text-gray-900 font-lusitana ml-3">
                        {product.prix_unitaire.toFixed(2)} €
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.href = `/produit/${product.id}`}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all font-montserrat ${
                        product.stock > 0
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Sélectionner' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Feed Tissus */}
      {activeTab === 'tissus' && (
        <div className="max-w-4xl mx-auto">
          {tissus.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-montserrat">Aucun tissu disponible</p>
            </div>
          ) : (
            tissus.map((tissu) => (
              <article key={tissu.id} className="bg-white mb-6">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 mx-4">
                  <div 
                    className="relative w-full aspect-[4/5] bg-gray-50 cursor-pointer overflow-hidden"
                    onClick={() =>
                      (window.location.href = selectionMode
                        ? `/tissu/${tissu.id}?selection=1`
                        : `/tissu/${tissu.id}`)
                    }
                  >
                    <img
                      src={tissu.imagePath}
                      alt={tissu.matiere}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />

                    {tissu.metrage_dispo < 10 && tissu.metrage_dispo > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Plus que {tissu.metrage_dispo}m !
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Matière et Prix */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 font-montserrat">
                        {tissu.matiere}
                      </p>
                      <div className="text-2xl font-bold text-orange-500 font-lusitana">
                        {tissu.prix_unitaire.toFixed(0)}€/m
                      </div>
                    </div>

                    {/* Titre */}
                    <h2 
                      className="text-xl font-bold text-gray-900 font-lusitana mb-1 cursor-pointer hover:text-cyan-950 transition-colors"
                      onClick={() =>
                        (window.location.href = selectionMode
                          ? `/tissu/${tissu.id}?selection=1`
                          : `/tissu/${tissu.id}`)
                      }
                    >
                      {tissu.matiere} {tissu.couleur}
                    </h2>

                    {/* Fournisseur */}
                    <p className="text-sm text-gray-600 font-montserrat mb-4">
                      par {tissu.fournisseur.nom_societe}
                    </p>

                    {/* Pastilles de couleur */}
                    <div className="flex gap-2 mb-4">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: tissu.couleur.toLowerCase() }}
                        title={tissu.couleur}
                      />
                      {/* Vous pouvez ajouter d'autres variations de couleur ici */}
                    </div>

                    {/* Bouton */}
                    <button
                      onClick={() =>
                      (window.location.href = selectionMode
                        ? `/tissu/${tissu.id}?selection=1`
                        : `/tissu/${tissu.id}`)
                    }
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all font-montserrat bg-black text-white hover:bg-gray-800"
                    >
                      Sélectionner
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      {!selectionMode && (
        <nav className="fixed bottom-0 left-0 right-0 bg-creatorcolor border-t border-gray-700 shadow-lg z-50">
          <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
            <button className="flex flex-col items-center justify-center p-2 text-yellow-100 font-semibold">
              <Home size={24} className="mb-0.5" />
              <span className="text-xs font-medium font-montserrat">Accueil</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 text-gray-300 hover:text-yellow-100 transition-colors">
              <Search size={24} className="mb-0.5" />
              <span className="text-xs font-medium font-montserrat">Tissus</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 text-gray-300 hover:text-yellow-100 transition-colors">
              <ShoppingCart size={24} className="mb-0.5" />
              <span className="text-xs font-medium font-montserrat">Panier</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 text-gray-300 hover:text-yellow-100 transition-colors">
              <User size={24} className="mb-0.5" />
              <span className="text-xs font-medium font-montserrat">Profil</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
