"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Alert from '@/components/Alert';
import { EmailIcon, PasswordIcon } from '@/components/Icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setAlert({ type: 'success', message: 'Connexion réussie ! Redirection...' });
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setAlert({ type: 'error', message: result.message || 'Erreur lors de la connexion' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setAlert({ type: 'error', message: 'Erreur lors de la connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <Header title="Connectez-vous" />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md px-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Titre du formulaire */}
            <div className="text-left">
                <h2 className="text-2xl text-black font-lusitana mb-6">Identifiez-vous</h2>
            </div>

            {/* Alerte */}
            {alert && (
              <Alert 
                type={alert.type} 
                message={alert.message} 
                onClose={() => setAlert(null)}
              />
            )}

            {/* Champ Email */}
            <div className="mb-10">
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e-mail"
                icon={<EmailIcon className="w-5 h-5" />}
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="mb-6">
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
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