"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { EmailIcon } from '@/components/Icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

//   Fonction de validation de l'email ajoutée ici aussi db plus tard
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Veuillez saisir votre adresse e-mail');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Veuillez saisir une adresse e-mail valide');
      return;
    }

    setEmailError('');
    // Simulation d'envoi d'email
    console.log('Email de récupération envoyé à:', email);
    setIsEmailSent(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  if (isEmailSent) {
    // Écran de confirmation
    return (
      <div className="min-h-screen bg-white relative">
        <Header title="Récupération" onBack={handleBackToLogin} />
        <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md px-8">
            <div className="text-center space-y-6">
              {/* Icône de validation */}
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Titre */}
              <div className="text-left">
                <h2 className="text-2xl text-black font-lusitana mb-4">E-mail envoyé !</h2>
              </div>

              {/* Message */}
              <div className="text-left space-y-4 mb-6">
                <p className="text-black font-montserrat text-base">
                  Un lien de récupération a été envoyé à :
                </p>
                <p className="text-cyan-950 font-montserrat font-semibold text-base">
                  {email}
                </p>
                <p className="text-zinc-600 font-montserrat text-sm">
                  Vérifiez votre boîte de réception et vos courriers indésirables. 
                  Le lien est valable pendant 24 heures.
                </p>
              </div>

              {/* Bouton retour */}
              <div className="mb-6">
                <Button
                  onClick={handleBackToLogin}
                  className="w-full"
                >
                  Retour à la connexion
                </Button>
              </div>

              {/* Renvoyer l'email */}
              <div className="text-center">
                <span className="text-sm font-montserrat text-zinc-800">Vous n'avez rien reçu ? </span>
                <Button 
                  variant="link"
                  onClick={() => setIsEmailSent(false)}
                >
                  RENVOYER
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire de saisie d'email
  return (
    <div className="min-h-screen bg-white relative">
      <Header title="Récupération" onBack={handleBackToLogin} />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md px-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Titre du formulaire */}
            <div className="text-left">
              <h2 className="text-2xl text-black font-lusitana mb-4">Mot de passe oublié</h2>
              <p className="text-zinc-600 font-montserrat text-sm mb-6">
                Saisissez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            {/* Champ Email */}
            <div className="mb-2">
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                error={!!emailError}
                placeholder="e-mail"
                icon={<EmailIcon className="w-5 h-5" />}
              />
            </div>

            {/* Zone d'erreur avec hauteur fixe */}
            <div className="h-6 mb-6">
              {emailError && (
                <div className="text-rose-800 text-xs sm:text-sm font-montserrat">
                  {emailError}
                </div>
              )}
            </div>

            {/* Bouton d'envoi */}
            <div className="mb-6">
              <Button
                type="submit"
                className="w-full"
              >
                Envoyer le lien
              </Button>
            </div>

            {/* Retour à la connexion */}
            <div className="text-center">
              <span className="text-sm font-montserrat text-zinc-800 font-medium">Vous vous souvenez ? </span>
              <Button
                type="button"
                variant="link"
                onClick={handleBackToLogin}
              >
                SE CONNECTER
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}