"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";


export default function AjouterProduit() {
  // États pour le PRODUIT
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // État pour le POST (Publication)
  const [createPost, setCreatePost] = useState(false);
  const [titrePost, setTitrePost] = useState("");
  const [descriptionPost, setDescriptionPost] = useState("");

  // États pour le contrôle de l'UI
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    // Données du PRODUIT
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("prix", prix);
    formData.append("stock", stock);
    formData.append("createPost", String(createPost));
    if (image) formData.append("image", image);

    // Données du POST (si coché)
    if (createPost) {
      formData.append("titrePost", titrePost);
      formData.append("descriptionPost", descriptionPost);
    }

    try {
      const res = await fetch("/api/produit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Erreur lors de la création du produit");
        return;
      }

      const data = await res.json().catch(() => null);
      if (data?.produitId) {
        window.location.href = `/produit/${data.produitId}`;
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">

      {/* Titre page */}
      <h1 className="mt-5 mb-10 text-xl text-black font-lusitana">
        Ajouter un produit
      </h1>

      <div className="flex-1 w-full flex items-start justify-center">
        <div className="w-full px-4">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* CHAMPS PRODUIT (Conservés) */}
            <Input
              id="nomProduit"
              placeholder="Nom du produit"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
            <textarea
              id="descriptionProduit"
              className="w-full p-3 rounded-md bg-input-bg font-montserrat text-black focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Description du produit"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {/* ... Prix et Stock (conservés) ... */}
            <input
              id="prixProduit"
              type="number"
              required
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              placeholder="Prix (€)"
              className="w-full pl-3 pr-3 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            <input
              id="stockProduit"
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock disponible"
              className="w-full pl-3 pr-3 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />

            {/* Image (conservé) */}
            <input
              id="imageProduit"
              type="file"
              accept="image/*"
              className="w-full text-sm font-montserrat"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />

            {/* Checkbox créer un post (Conservé) */}
            <label
              htmlFor="createPost"
              className="flex items-center gap-3 text-sm font-montserrat text-black"
            >
              <input
                id="createPost"
                type="checkbox"
                checked={createPost}
                onChange={(e) => setCreatePost(e.target.checked)}
                className="w-4 h-4"
              />
              Publier un post sur mon profil créateur
            </label>

            {/* NOUVEAUX CHAMPS DE POST (Affichage Conditionnel) */}
            {createPost && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h2 className="text-lg font-serif text-black">Détails de la publication</h2>

                {/* Titre du Post */}
                <Input
                  id="titrePost"
                  placeholder="Titre de la publication (ex: Nouveaux Tissus en Laine)"
                  value={titrePost}
                  onChange={(e) => setTitrePost(e.target.value)}
                  required // Le titre est requis si le post est coché
                />

                {/* Description du Post */}
                <textarea
                  id="descriptionPost"
                  className="w-full p-3 rounded-md bg-input-bg font-montserrat text-black focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  placeholder="Écrivez le texte qui accompagnera la publication."
                  rows={4}
                  value={descriptionPost}
                  onChange={(e) => setDescriptionPost(e.target.value)}
                  required // La description est requise si le post est coché
                />
              </div>
            )}

            {/* Bouton */}
            <Button type="submit" disabled={loading} className="w-full bg-creatorcolor">
              {loading ? "Création..." : "Ajouter le produit"}
            </Button>

          </form>
        </div>
        {/* Bottom navigation */}
        <BottomNavClientWrapper />
      </div>

    </div>
  );
}
