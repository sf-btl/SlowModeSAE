"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function AjouterProduit() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [categorie, setCategorie] = useState("AUTRE");
  const [image, setImage] = useState<File | null>(null);

  const [createPost, setCreatePost] = useState(false);
  const [titrePost, setTitrePost] = useState("");
  const [descriptionPost, setDescriptionPost] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("prix", prix);
    formData.append("stock", stock);
    formData.append("categorie", categorie);
    formData.append("createPost", String(createPost));
    if (image) formData.append("image", image);

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
        alert("Erreur lors de la creation du produit");
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
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Catalogue</p>
        <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">Ajouter un produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        <Input
          id="nomProduit"
          placeholder="Nom du produit"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <textarea
          id="descriptionProduit"
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          placeholder="Description du produit"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          id="categorieProduit"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
        >
          <option value="AUTRE">Autre</option>
          <option value="CHEMISE">Chemise</option>
          <option value="T_SHIRT">T-shirt</option>
          <option value="PULL">Pull</option>
          <option value="VESTE">Veste</option>
          <option value="MANTEAU">Manteau</option>
          <option value="PANTALON">Pantalon</option>
          <option value="JUPE">Jupe</option>
          <option value="ROBE">Robe</option>
          <option value="COMBINAISON">Combinaison</option>
          <option value="ACCESSOIRE">Accessoire</option>
        </select>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            id="prixProduit"
            type="number"
            required
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="Prix (€)"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          />
          <input
            id="stockProduit"
            type="number"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock disponible"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          />
        </div>

        <input
          id="imageProduit"
          type="file"
          accept="image/*"
          className="w-full text-sm font-montserrat text-zinc-600"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <label htmlFor="createPost" className="flex items-center gap-3 text-sm font-montserrat text-zinc-700">
          <input
            id="createPost"
            type="checkbox"
            checked={createPost}
            onChange={(e) => setCreatePost(e.target.checked)}
            className="h-4 w-4"
          />
          Publier un post sur mon profil createur
        </label>

        {createPost && (
          <div className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4">
            <h2 className="text-base font-semibold text-zinc-900">Details de la publication</h2>
            <Input
              id="titrePost"
              placeholder="Titre de la publication (ex: Nouveaux tissus en laine)"
              value={titrePost}
              onChange={(e) => setTitrePost(e.target.value)}
              required
            />
            <textarea
              id="descriptionPost"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
              placeholder="Decrivez la publication."
              rows={4}
              value={descriptionPost}
              onChange={(e) => setDescriptionPost(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creation..." : "Ajouter le produit"}
        </Button>
      </form>
    </div>
  );
}
