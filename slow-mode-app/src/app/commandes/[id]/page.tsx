"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type CommandeDetail = {
  id: number;
  code: string;
  statut: string;
  type: "PRODUIT" | "PROJET";
  couturierName: string | null;
  montant_total?: number;
  date?: string;
  adresse_livraison?: string;
  lignes?: {
    id: number;
    quantite: number;
    prix_unitaire: number;
    produit: string | null;
    tissu: string | null;
  }[];
  projet: null | {
    typeProjet: string;
    categorie: string;
    tissu: string | null;
    description: string | null;
    images: string[];
    mensurations: Record<string, string>;
  };
};

export default function CommandeDetailPage() {
  const params = useParams<{ id: string }>();
  const [commande, setCommande] = useState<CommandeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/commandes/${params.id}`, { cache: "no-store" });
        const json = await res.json();
        if (json?.success) {
          setCommande(json.commande);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  const formattedCategorie = useMemo(() => {
    if (!commande?.projet?.categorie) return "";
    const map: Record<string, string> = {
      TOPS: "Hauts",
      BOTTOMS: "Bas",
      FULL_BODY: "Robes et combinaisons",
      OUTERWEAR: "Vetements d'exterieur",
      LINGERIE: "Lingerie, bain et nuit",
      ACCESSORIES: "Accessoires et textile maison",
    };
    return map[commande.projet.categorie] ?? commande.projet.categorie;
  }, [commande]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Chargement...</p>;
  }

  if (!commande) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-500">Commande introuvable.</p>
        <Link href="/commandes" className="text-sm text-cyan-950">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-montserrat text-zinc-900">
      <div>
        <Link href="/commandes" className="text-sm text-zinc-500">
          Retour
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">{commande.code}</h1>
        <p className="mt-1 text-sm text-cyan-950">{commande.statut}</p>
      </div>

      <div className="space-y-3 rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-sm">
        <p className="text-xs text-zinc-500">Type de commande</p>
        <p className="text-sm font-semibold">
          {commande.type === "PROJET" ? "Projet couture" : "Commande marketplace"}
        </p>
        <div className="text-sm text-zinc-600">
          <p className="text-xs text-zinc-500">Date de creation</p>
          <p>
            {commande.date
              ? new Date(commande.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </p>
        </div>
        <div className="text-sm text-zinc-600">
          <p className="text-xs text-zinc-500">Adresse de livraison</p>
          <p>{commande.adresse_livraison || "-"}</p>
        </div>
      </div>

      {commande.type === "PROJET" && commande.projet && (
        <div className="space-y-4 rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-sm">
          <div>
            <p className="text-xs text-zinc-500">Type de vetement</p>
            <p className="text-sm font-semibold">{formattedCategorie}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Type de projet</p>
            <p className="text-sm font-semibold">
              {commande.projet.typeProjet === "CREATION" ? "Creation" : "Retouche"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Tissu choisi</p>
            <p className="text-sm font-semibold">
              {commande.projet.tissu ?? "Tissu personnel"}
            </p>
          </div>
          {commande.couturierName && (
            <div>
              <p className="text-xs text-zinc-500">Couturier</p>
              <p className="text-sm font-semibold">{commande.couturierName}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-zinc-500">Description</p>
            <p className="text-sm text-zinc-600">
              {commande.projet.description || "Aucune description fournie."}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Mensurations</p>
            <div className="mt-2 space-y-1 text-sm text-zinc-600">
              {Object.entries(commande.projet.mensurations || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}</span>
                  <span>{value} cm</span>
                </div>
              ))}
            </div>
          </div>
          {commande.projet.images?.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500">Photos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {commande.projet.images.map((src) => (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setPreviewImage(src)}
                    className="h-16 w-16 overflow-hidden rounded-lg"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {commande.type === "PRODUIT" && (
        <div className="space-y-4 rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-sm">
          <div>
            <p className="text-xs text-zinc-500">Articles commandes</p>
            <div className="mt-2 space-y-3 text-sm text-zinc-600">
              {(commande.lignes ?? []).map((ligne) => (
                <div
                  key={ligne.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {ligne.produit || ligne.tissu || "Article"}
                    </p>
                    <p className="text-xs text-zinc-500">Quantite: {ligne.quantite}</p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {(ligne.prix_unitaire * ligne.quantite).toFixed(2)} €
                  </p>
                </div>
              ))}
              {(!commande.lignes || commande.lignes.length === 0) && (
                <p className="text-sm text-zinc-500">Aucun article associe.</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-sm font-semibold text-zinc-900">
            <span>Total</span>
            <span>
              {commande.montant_total !== undefined
                ? `${commande.montant_total.toFixed(2)} €`
                : "-"}
            </span>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-3xl items-center justify-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-zinc-900 shadow"
              aria-label="Fermer l'aperçu"
            >
              X
            </button>
            <img
              src={previewImage}
              alt=""
              className="max-h-[85vh] w-full rounded-2xl object-contain shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
