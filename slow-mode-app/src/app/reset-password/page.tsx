"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { PasswordIcon } from "@/components/Icons";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        setTokenValid(data.valid);
      } catch (error) {
        console.error("Erreur lors de la validation du token:", error);
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Token de reinitialisation manquant ou invalide");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la reinitialisation");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la reinitialisation");
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <Loading message="Verification du lien..." title="Validation" />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f1e8,_#ffffff_65%)] text-zinc-900">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-zinc-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-lusitana text-xl tracking-[0.3em] text-cyan-950">
            SLOWMODE
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="rounded-full border border-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-950 transition-colors hover:bg-cyan-950 hover:text-white"
            >
              S&apos;inscrire
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-cyan-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-900"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-amber-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />

        <div className="mx-auto w-full max-w-3xl px-6 py-12 lg:py-20">
          <div className="rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
            {!token || tokenValid === false ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-lusitana text-cyan-950">Lien invalide</h2>
                <p className="text-sm text-zinc-600">
                  Le lien de reinitialisation est invalide ou a expire.
                </p>
                <Button onClick={() => (window.location.href = "/forgot-password")}>
                  Demander un nouveau lien
                </Button>
              </div>
            ) : success ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-lusitana text-cyan-950">Mot de passe mis a jour</h2>
                <p className="text-sm text-zinc-600">
                  Votre mot de passe a ete reinitialise avec succes.
                </p>
                <Button onClick={() => (window.location.href = "/login")}>Se connecter</Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <p className="text-xs font-montserrat uppercase tracking-[0.35em] text-zinc-500">
                    Nouveau mot de passe
                  </p>
                  <h2 className="mt-3 text-2xl font-lusitana text-cyan-950">
                    Choisissez un nouveau mot de passe.
                  </h2>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  placeholder="Nouveau mot de passe"
                  icon={<PasswordIcon className="w-5 h-5" />}
                  minLength={6}
                />

                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!error}
                  placeholder="Confirmer le mot de passe"
                  icon={<PasswordIcon className="w-5 h-5" />}
                />

                {error && <div className="text-rose-800 text-xs font-montserrat">{error}</div>}

                <Button type="submit" disabled={loading}>
                  {loading ? "Mise a jour..." : "Mettre a jour le mot de passe"}
                </Button>

                <div className="text-center text-sm font-montserrat text-zinc-700">
                  Vous vous souvenez ?{" "}
                  <Link
                    href="/login"
                    className="font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
                  >
                    Se connecter
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
