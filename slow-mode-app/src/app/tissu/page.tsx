// components/AjouterTissu.tsx (Fichier COMPLET)

"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import BottomNavClientWrapper from "@/components/BottomNavClientWrapper";


export default function AjouterTissu() {
    // États pour le TISSU (Noms de colonnes du formulaire)
    const [couleur, setCouleur] = useState("");
    const [matiere, setMatiere] = useState("");
    const [grammage, setGrammage] = useState(""); // Poids
    const [prix, setPrix] = useState(""); // Prix unitaire
    const [metrageDispo, setMetrageDispo] = useState(""); // Stock
    const [image, setImage] = useState<File | null>(null);

    // État pour le POST (Publication)
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
        // Clés de FormData doivent correspondre à ce que l'API attend
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
                // Gestion des erreurs (400, 401, 403, 500)
                setError(data.message || "Erreur lors de la création du tissu.");
                return;
            }

            // Succès: Redirection
            window.location.href = "/fournisseur/dashboard"; // Ajustez la redirection si besoin
        } catch (err) {
            console.error(err);
            setError("Erreur réseau ou serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            <h1 className="mt-5 mb-10 text-xl text-black font-lusitana">
                Ajouter un Tissu
            </h1>

            <div className="flex-1 w-full flex items-start justify-center">
                <div className="w-full max-w-[380px] px-6">

                    {/* Affichage des erreurs */}
                    {error && (
                        <div className="mb-4 p-3 text-sm font-montserrat text-red-700 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* MATIERE (String) */}
                        <Input
                            id="matiereTissu"
                            placeholder="Matière (ex: Coton, Laine)"
                            value={matiere}
                            onChange={(e) => setMatiere(e.target.value)}
                            required
                        />

                        {/* COULEUR (String) */}
                        <Input
                            id="couleurTissu"
                            placeholder="Couleur (ex: Bleu Marine, Écru)"
                            value={couleur}
                            onChange={(e) => setCouleur(e.target.value)}
                            required
                        />

                        {/* GRAMMAGE (Int) */}
                        <input
                            id="grammageTissu"
                            type="number"
                            required
                            value={grammage}
                            onChange={(e) => setGrammage(e.target.value)}
                            placeholder="Grammage (g/m²)"
                            className="w-full pl-3 pr-3 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />

                        {/* PRIX UNTIATAIRE (Float) */}
                        <input
                            id="prixTissu"
                            type="number"
                            step="0.01"
                            required
                            value={prix}
                            onChange={(e) => setPrix(e.target.value)}
                            placeholder="Prix au mètre/unité (€)"
                            className="w-full pl-3 pr-3 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />

                        {/* METRAGE DISPONIBLE (Float) */}
                        <input
                            id="metrageDispo"
                            type="number"
                            step="0.01"
                            required
                            value={metrageDispo}
                            onChange={(e) => setMetrageDispo(e.target.value)}
                            placeholder="Métrage disponible (m)"
                            className="w-full pl-3 pr-3 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />

                        {/* Image */}
                        <input
                            id="imageTissu"
                            type="file"
                            accept="image/*"
                            className="w-full text-sm font-montserrat"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />

                        {/* Checkbox créer un post */}
                        <label
                            htmlFor="createPost"
                            className="flex items-center gap-3 text-sm font-montserrat text-zinc-800"
                        >
                            <input
                                id="createPost"
                                type="checkbox"
                                checked={createPost}
                                onChange={(e) => setCreatePost(e.target.checked)}
                                className="w-4 h-4"
                            />
                            Publier un post sur mon profil
                        </label>

                        {/* CHAMPS DE POST (Affichage Conditionnel) */}
                        {createPost && (
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h2 className="text-lg font-serif text-zinc-700">Détails de la publication</h2>

                                <Input
                                    id="titrePost"
                                    placeholder="Titre de la publication"
                                    value={titrePost}
                                    onChange={(e) => setTitrePost(e.target.value)}
                                    required
                                />

                                <textarea
                                    id="descriptionPost"
                                    className="w-full p-3 rounded-md bg-input-bg font-montserrat text-black focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                    placeholder="Description de la publication"
                                    rows={4}
                                    value={descriptionPost}
                                    onChange={(e) => setDescriptionPost(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Bouton */}
                        <Button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600">
                            {loading ? "Création..." : "Ajouter le Tissu"}
                        </Button>

                    </form>
                </div>
                <BottomNavClientWrapper />
            </div>
        </div>
    );
}