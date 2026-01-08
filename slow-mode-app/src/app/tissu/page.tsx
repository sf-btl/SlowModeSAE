"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function AjouterTissu() {
  const [couleur, setCouleur] = useState("");
  const [matiere, setMatiere] = useState("");
  const [grammage, setGrammage] = useState("");
  const [prix, setPrix] = useState("");
  const [metrageDispo, setMetrageDispo] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [createPost, setCreatePost] = useState(false);
  const [titrePost, setTitrePost] = useState("");
  const [descriptionPost, setDescriptionPost] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("couleur", couleur);
    formData.append("matiere", matiere);
    formData.append("grammage", grammage);
    formData.append("prix_unitaire", prix);
    formData.append("metrage_dispo", metrageDispo);
    if (image) formData.append("image", image);

    formData.append("createPost", String(createPost));
    if (createPost) {
      formData.append("titrePost", titrePost);
      formData.append("descriptionPost", descriptionPost);
    }

    try {
      const res = await fetch("/api/tissu", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de la creation du tissu.");
        return;
      }

      if (data?.tissuId) {
        window.location.href = `/tissu/${data.tissuId}`;
        return;
      }

      window.location.href = "/fournisseur/dashboard";
    } catch (err) {
      console.error(err);
      setError("Erreur reseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Catalogue</p>
        <h1 className="mt-3 text-3xl font-lusitana text-cyan-950">Ajouter un tissu</h1>
      </div>

      <div className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm">
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="matiereTissu"
            placeholder="Matiere (ex: Coton, Laine)"
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
            required
          />

          <Input
            id="couleurTissu"
            placeholder="Couleur (ex: Bleu marine, Ecru)"
            value={couleur}
            onChange={(e) => setCouleur(e.target.value)}
            required
          />

          <input
            id="grammageTissu"
            type="number"
            required
            value={grammage}
            onChange={(e) => setGrammage(e.target.value)}
            placeholder="Grammage (g/m2)"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          />

          <input
            id="prixTissu"
            type="number"
            step="0.01"
            required
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="Prix au metre (€)"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          />

          <input
            id="metrageDispo"
            type="number"
            step="0.01"
            required
            value={metrageDispo}
            onChange={(e) => setMetrageDispo(e.target.value)}
            placeholder="Metrage disponible (m)"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
          />

          <input
            id="imageTissu"
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
            Publier un post sur mon profil
          </label>

          {createPost && (
            <div className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4">
              <h2 className="text-base font-semibold text-zinc-900">Details de la publication</h2>
              <Input
                id="titrePost"
                placeholder="Titre de la publication"
                value={titrePost}
                onChange={(e) => setTitrePost(e.target.value)}
                required
              />
              <textarea
                id="descriptionPost"
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-900/20"
                placeholder="Description de la publication"
                rows={4}
                value={descriptionPost}
                onChange={(e) => setDescriptionPost(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creation..." : "Ajouter le tissu"}
          </Button>
        </form>
      </div>
    </div>
  );
}
