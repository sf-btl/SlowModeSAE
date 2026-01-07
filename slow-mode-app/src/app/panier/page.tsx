"use client";

import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          total: getTotalPrice(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Commande validée avec succès !");
        clearCart();
        window.location.href = "/profil"; // Redirection vers le profil
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-20">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 font-lusitana">
              Mon Panier
            </h1>
          </div>
        </header>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 font-lusitana mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-800 font-montserrat mb-6 text-center">
            Découvrez nos créations et ajoutez vos articles préférés
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-black text-white px-8 py-3 rounded-xl font-semibold font-montserrat hover:bg-gray-800 transition-colors"
          >
            Découvrir les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-lusitana">
            Mon Panier ({getTotalItems()})
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Liste des articles */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag size={32} />
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 font-lusitana text-lg">
                        {item.nom}
                      </h3>
                      <p className="text-sm text-gray-800 font-montserrat">
                        {item.type === "tissu" ? "Tissu" : "Produit"}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Prix & quantité */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-lg font-bold text-gray-900 font-lusitana">
                      {item.prix.toFixed(2)} €
                      {item.unite ? `/${item.unite}` : ""}
                    </div>

                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, item.quantite - 1)
                        }
                        disabled={item.quantite <= 1}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Minus size={16} className="text-gray-500" />
                      </button>

                      <span className="font-semibold text-gray-900 min-w-[2ch] text-center">
                        {item.quantite}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, item.quantite + 1)
                        }
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Plus size={16} className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Sous-total */}
                  <div className="mt-2 text-right">
                    <span className="text-sm text-gray-800 font-montserrat">
                      Sous-total :
                    </span>{" "}
                    <span className="font-bold text-gray-900">
                      {(item.prix * item.quantite).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 font-lusitana mb-4">
            Résumé de la commande
          </h2>

          <div className="flex justify-between text-gray-800 font-montserrat mb-3">
            <span>Sous-total ({getTotalItems()} articles)</span>
            <span className="font-semibold text-gray-900">
              {getTotalPrice().toFixed(2)} €
            </span>
          </div>

          <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{getTotalPrice().toFixed(2)} €</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full mt-6 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Traitement..." : "Passer la commande"}
          </button>
        </div>
      </div>
    </div>
  );
}
