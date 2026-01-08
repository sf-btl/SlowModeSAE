"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Alert from "@/components/Alert";
import { EmailIcon, PasswordIcon } from "@/components/Icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setAlert({ type: "success", message: "Connexion reussie ! Redirection..." });
        setTimeout(() => {
          window.location.href = "/profil";
        }, 1500);
      } else {
        setAlert({ type: "error", message: result.message || "Erreur lors de la connexion" });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setAlert({ type: "error", message: "Erreur lors de la connexion" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#f7f1e8,_#ffffff_65%)] text-zinc-900">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-zinc-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-lusitana text-xl tracking-[0.3em] text-cyan-950">
            SLOWMODE
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-istok-web uppercase tracking-wide text-zinc-700 lg:flex">
            <Link href="/#projet" className="hover:text-cyan-950 transition-colors">
              Projet
            </Link>
            <Link href="/#methode" className="hover:text-cyan-950 transition-colors">
              Methode
            </Link>
            <Link href="/#impact" className="hover:text-cyan-950 transition-colors">
              Impact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="rounded-full border border-cyan-950 px-4 py-2 text-sm font-semibold text-cyan-950 transition-colors hover:bg-cyan-950 hover:text-white"
            >
              S&apos;inscrire
            </Link>
            <span className="hidden rounded-full bg-cyan-950 px-4 py-2 text-sm font-semibold text-white sm:inline">
              Se connecter
            </span>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-amber-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="order-2 flex flex-col justify-center gap-6 lg:order-1">
            <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-zinc-600">
              Retour a une mode locale
            </p>
            <h1 className="text-4xl font-lusitana text-cyan-950 sm:text-5xl">
              Connectez-vous pour dialoguer avec un artisan pres de chez vous.
            </h1>
            <p className="text-base font-istok-web leading-relaxed text-zinc-700">
              Accedez a vos projets, suivez vos commandes et discutez en direct avec les couturiers
              et fournisseurs de votre region.
            </p>
            <div className="rounded-3xl border border-white/60 bg-white/80 p-3 shadow-lg">
              <Image
                src="/uploads/1767778118410-jsaeo4p.avif"
                alt="Atelier et tissu responsable"
                width={620}
                height={420}
                className="h-56 w-full rounded-[24px] object-cover sm:h-64"
                priority
              />
            </div>
          </div>

          <div className="order-1 flex items-center lg:order-2">
            <div className="w-full rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <p className="text-xs font-montserrat uppercase tracking-[0.35em] text-zinc-500">
                  Connexion
                </p>
                <h2 className="mt-3 text-3xl font-lusitana text-cyan-950">Bon retour parmi nous.</h2>
              </div>

              {alert && (
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  icon={<EmailIcon className="w-5 h-5" />}
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  icon={<PasswordIcon className="w-5 h-5" />}
                />

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
                  >
                    Mot de passe oublie ?
                  </Link>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>

              <div className="mt-8 flex items-center justify-between text-sm">
                <span className="font-montserrat text-zinc-700">Pas encore de compte ?</span>
                <Link
                  href="/register"
                  className="font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
                >
                  Creer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
