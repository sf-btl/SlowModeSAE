"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // État pour gérer l'affichage de l'écran de chargement
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule un temps de chargement de 3 secondes (3000ms)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Nettoyage du timer si le composant est démonté
    return () => clearTimeout(timer);
  }, []);

  // --- ÉCRAN DE CHARGEMENT (SPLASH SCREEN) ---
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="animate-bounce text-5xl sm:text-6xl md:text-7xl font-normal text-cyan-950 font-lusitana">
            SlowMode
          </h1>
          <p className="animate-pulse mt-4 text-cyan-950 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  // --- ÉCRAN D'ACCUEIL AVEC BOUTONS ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 fade-in-animation">
      <div className="text-center w-full max-w-md">
        {/* Titre / Logo */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal text-cyan-950 font-lusitana mb-12">
          SlowMode
        </h1>

        {/* Conteneur des boutons */}
        <div className="flex flex-col gap-4">
          {/* Bouton Connexion */}
          <Link
            href="/login"
            className="w-full bg-cyan-950 text-white px-6 py-3 rounded-md hover:bg-zinc-800 transition-colors font-medium"
          >
            Connexion
          </Link>

          {/* Bouton Inscription (Style secondaire pour différencier) */}
          <Link
            href="/register"
            className="w-full bg-white text-zinc-900 border border-zinc-200 px-6 py-3 rounded-md hover:bg-zinc-50 transition-colors font-medium"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
}