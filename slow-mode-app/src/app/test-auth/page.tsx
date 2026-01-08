"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/Button";
import Alert from "@/components/Alert";

export default function TestAuth() {
  const { user, loading, logout } = useAuth();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleLogout = async () => {
    try {
      setAlert({ type: "success", message: "Deconnexion reussie ! Redirection..." });
      await logout();
    } catch (error) {
      console.error("Erreur:", error);
      setAlert({ type: "error", message: "Erreur lors de la deconnexion" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f1e8,_#ffffff_65%)]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <p className="text-zinc-600 font-montserrat">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f1e8,_#ffffff_65%)] text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <div className="w-full rounded-3xl border border-zinc-100 bg-white/80 p-8 shadow-sm">
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          {user ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Session</p>
                <h2 className="mt-3 text-3xl font-lusitana text-cyan-950">Utilisateur connecte</h2>
                <p className="text-sm text-zinc-600 font-montserrat mt-2">
                  Informations de votre session JWT
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-white px-6 py-4 space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <p className="text-xs font-montserrat text-zinc-500 uppercase mb-1">Email</p>
                  <p className="text-lg font-istok-web text-zinc-900">{user.email}</p>
                </div>

                <div className="border-b border-zinc-100 pb-3">
                  <p className="text-xs font-montserrat text-zinc-500 uppercase mb-1">Nom complet</p>
                  <p className="text-lg font-istok-web text-zinc-900">
                    {user.prenom} {user.nom}
                  </p>
                </div>

                <div className="border-b border-zinc-100 pb-3">
                  <p className="text-xs font-montserrat text-zinc-500 uppercase mb-1">Type de compte</p>
                  <p className="text-lg font-istok-web text-zinc-900 capitalize">{user.accountType}</p>
                </div>

                <div>
                  <p className="text-xs font-montserrat text-zinc-500 uppercase mb-1">ID Utilisateur</p>
                  <p className="text-lg font-istok-web text-zinc-900">{user.userId}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleLogout} className="flex-1">
                  Se deconnecter
                </Button>
                <Button onClick={() => (window.location.href = "/")} variant="link" className="flex-1">
                  Retour a l'accueil
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-lusitana text-cyan-950 mb-4">Non authentifie</h2>
              <p className="text-zinc-600 font-montserrat mb-6">
                Vous devez vous connecter pour acceder a cette page.
              </p>
              <Button onClick={() => (window.location.href = "/login")}>Se connecter</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
