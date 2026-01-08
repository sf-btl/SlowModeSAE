"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } =
    useCart();
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
        alert("Commande validee avec succes !");
        clearCart();
        window.location.href = "/profil";
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
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Panier</p>
          <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">Mon panier</h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-100 bg-white/80 px-6 py-12 text-center">
          <ShoppingBag size={64} className="text-zinc-300 mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 font-lusitana mb-2">
            Votre panier est vide
          </h2>
          <p className="text-zinc-600 font-montserrat mb-6 text-center">
            Decouvrez nos creations et ajoutez vos articles preferes.
          </p>
          <button
            onClick={() => (window.location.href = "/marketplace")}
            className="rounded-full bg-cyan-950 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-900"
          >
            Decouvrir les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Panier</p>
        <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">
          Mon panier ({getTotalItems()})
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="rounded-3xl border border-zinc-100 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full sm:w-28">
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100">
                    {item.image ? (
                      <img src={item.image} alt={item.nom} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <ShoppingBag size={28} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-zinc-900 font-lusitana text-lg">
                        {item.nom}
                      </h3>
                      <p className="text-sm text-zinc-600 font-montserrat">
                        {item.type === "tissu" ? "Tissu" : "Produit"}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="rounded-full border border-zinc-200 p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-lg font-semibold text-zinc-900 font-lusitana">
                      {item.prix.toFixed(2)} €
                      {item.unite ? `/${item.unite}` : ""}
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantite - 1)}
                        disabled={item.quantite <= 1}
                        className="rounded-full p-1 hover:bg-white transition-colors"
                      >
                        <Minus size={16} className="text-zinc-500" />
                      </button>

                      <span className="font-semibold text-zinc-900 min-w-[2ch] text-center">
                        {item.quantite}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantite + 1)}
                        className="rounded-full p-1 hover:bg-white transition-colors"
                      >
                        <Plus size={16} className="text-zinc-700" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 text-right text-sm text-zinc-600">
                    Sous-total :{" "}
                    <span className="font-semibold text-zinc-900">
                      {(item.prix * item.quantite).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold text-zinc-900 font-lusitana mb-4">
            Resume de la commande
          </h2>

          <div className="flex justify-between text-zinc-600 font-montserrat mb-3">
            <span>Sous-total ({getTotalItems()} articles)</span>
            <span className="font-semibold text-zinc-900">{getTotalPrice().toFixed(2)} €</span>
          </div>

          <div className="border-t border-zinc-100 pt-4 flex justify-between text-lg font-semibold text-zinc-900">
            <span>Total</span>
            <span>{getTotalPrice().toFixed(2)} €</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full mt-6 rounded-full bg-cyan-950 py-3 text-sm font-semibold text-white hover:bg-cyan-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Traitement..." : "Passer la commande"}
          </button>
        </div>
      </div>
    </div>
  );
}
