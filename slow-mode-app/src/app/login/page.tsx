"use client";

import Header from '@/components/Header';
import Button from '@/components/Button';
import { EmailIcon, PasswordIcon } from '@/components/Icons';

export default function Login() {
  return (
    <div className="min-h-screen bg-white relative">
      <Header title="Connectez-vous" />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md px-8">
          <form className="space-y-6">
            {/* Titre du formulaire */}
            <div className="text-left">
                <h2 className="text-2xl text-black font-lusitana mb-6">Identifiez-vous</h2>
            </div>

            {/* Champ Email */}
            <div className="relative mb-10">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <EmailIcon className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="w-full pl-3 pr-10 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="e-mail"
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <PasswordIcon className="w-5 h-5" />
              </div>
              <input
                id="password"
                type="password"
                required
                className="w-full pl-3 pr-10 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="Mot de Passe"
              />
            </div>

            {/* Lien mot de passe oublié */}
            <div className="text-right mb-6">
              <a href="/forgot-password" className="text-xs font-bold font-istok-web text-rose-800 hover:text-rose-800/80 transition-colors">
                MOT DE PASSE OUBLIÉ ?
              </a>
            </div>

            {/* Bouton de connexion */}
            <div className="mb-6">
                <Button type="submit">
                  Se connecter
                </Button>
            </div>

            {/* Nouveau utilisateur */}
            <div className="text-left mb-0">
              <span className="text-medium font-lusitana text-black">
                Nouveau sur SlowMode ?
              </span>
            </div>

            <div className="text-right">
              <a href="./register" className="text-sm/9 font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors">
                CRÉER UN COMPTE
              </a>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}