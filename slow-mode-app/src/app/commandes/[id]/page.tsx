"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";

type CommandeDetail = {
  id: number;
  code: string;
  statut: string;
  type: "PRODUIT" | "PROJET";
  couturierName: string | null;
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
      FULL_BODY: "Robes et Combinaisons",
      OUTERWEAR: "Vêtements d'Extérieur",
      LINGERIE: "Lingerie, Bain et Nuit",
      ACCESSORIES: "Accessoires et Textile Maison",
    };
    return map[commande.projet.categorie] ?? commande.projet.categorie;
  }, [commande]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 pt-10 font-montserrat text-[#1e1b24]">
        <p className="text-sm text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="min-h-screen bg-white px-6 pt-10 font-montserrat text-[#1e1b24]">
        <p className="text-sm text-gray-600">Commande introuvable.</p>
        <Link href="/commandes" className="mt-4 inline-block text-sm text-[#3c2a5d]">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 font-montserrat text-[#1e1b24]">
      <div className="mx-auto w-full max-w-md px-6 pt-8">
        <Link href="/commandes" className="text-sm text-gray-600">
          Retour
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">{commande.code}</h1>
        <p className="mt-1 text-sm text-[#3c2a5d]">{commande.statut}</p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Type de commande</p>
          <p className="mt-2 text-sm font-semibold">
            {commande.type === "PROJET" ? "Projet couture" : "Commande marketplace"}
          </p>
        </div>

        {commande.type === "PROJET" && commande.projet && (
          <div className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs text-gray-500">Type de vêtement</p>
              <p className="text-sm font-semibold">{formattedCategorie}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type de projet</p>
              <p className="text-sm font-semibold">
                {commande.projet.typeProjet === "CREATION" ? "Création" : "Retouche"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tissu choisi</p>
              <p className="text-sm font-semibold">
                {commande.projet.tissu ?? "Tissu personnel"}
              </p>
            </div>
            {commande.couturierName && (
              <div>
                <p className="text-xs text-gray-500">Couturier</p>
                <p className="text-sm font-semibold">{commande.couturierName}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-gray-700">
                {commande.projet.description || "Aucune description fournie."}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mensurations</p>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {Object.entries(commande.projet.mensurations || {}).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}</span>
                      <span>{value} cm</span>
                    </div>
                  )
                )}
              </div>
            </div>
            {commande.projet.images?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500">Photos</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {commande.projet.images.map((src) => (
                    <button
                      type="button"
                      key={src}
                      onClick={() => setPreviewImage(src)}
                      className="h-16 w-16 overflow-hidden rounded-lg"
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavClientWrapper />

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-3xl items-center justify-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg text-[#1e1b24] shadow"
              aria-label="Fermer l'aperçu"
            >
              ×
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
