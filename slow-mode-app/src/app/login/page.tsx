"use client";

import Header from '@/components/Header';
import Button from '@/components/Button';
import Input from '@/components/Input';
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
            <div className="mb-10">
              <Input
                id="email"
                type="email"
                required
                placeholder="e-mail"
                icon={<EmailIcon className="w-5 h-5" />}
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="mb-6">
              <Input
                id="password"
                type="password"
                required
                placeholder="mot de passe"
                icon={<PasswordIcon className="w-5 h-5" />}
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