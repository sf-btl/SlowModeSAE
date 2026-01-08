"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { EmailIcon } from "@/components/Icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Veuillez saisir votre adresse e-mail");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Veuillez saisir une adresse e-mail valide");
      return;
    }

    setEmailError("");
    setIsEmailSent(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError("");
    }
  };

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

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-[1fr_1fr] lg:py-20">
          <div className="flex flex-col justify-center gap-4">
            <p className="text-sm font-montserrat uppercase tracking-[0.35em] text-zinc-600">
              Recuperation
            </p>
            <h1 className="text-4xl font-lusitana text-cyan-950 sm:text-5xl">
              Reprenez l&apos;acces a votre compte.
            </h1>
            <p className="text-base font-istok-web leading-relaxed text-zinc-700">
              Indiquez votre adresse e-mail pour recevoir un lien de reinitialisation.
            </p>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[32px] border border-zinc-100 bg-white p-8 shadow-sm">
              {!isEmailSent ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <p className="text-xs font-montserrat uppercase tracking-[0.35em] text-zinc-500">
                      Mot de passe oublie
                    </p>
                    <h2 className="mt-3 text-2xl font-lusitana text-cyan-950">
                      Recevez un lien de reinitialisation.
                    </h2>
                  </div>

                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    error={!!emailError}
                    placeholder="E-mail"
                    icon={<EmailIcon className="w-5 h-5" />}
                  />

                  {emailError && (
                    <div className="text-rose-800 text-xs font-montserrat">{emailError}</div>
                  )}

                  <Button type="submit" className="w-full">
                    Envoyer le lien
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
              ) : (
                <div className="space-y-6 text-center">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-lusitana text-cyan-950">E-mail envoye !</h2>
                    <p className="mt-3 text-sm text-zinc-600">
                      Un lien de recuperation a ete envoye a :
                    </p>
                    <p className="mt-2 text-sm font-semibold text-cyan-950">{email}</p>
                    <p className="mt-3 text-xs text-zinc-500">
                      Verifiez votre boite de reception et vos courriers indesirables.
                    </p>
                  </div>
                  <Button onClick={() => setIsEmailSent(false)} className="w-full">
                    Renvoyer
                  </Button>
                  <div className="text-center text-sm font-montserrat text-zinc-700">
                    <Link
                      href="/login"
                      className="font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
                    >
                      Retour a la connexion
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
