"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

export default function TestAuth() {
  const { user, loading, logout } = useAuth();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLogout = async () => {
    try {
      setAlert({ type: 'success', message: 'Déconnexion réussie ! Redirection...' });
      await logout();
    } catch (error) {
      console.error('Erreur:', error);
      setAlert({ type: 'error', message: 'Erreur lors de la déconnexion' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative">
        <Header title="Test Authentification" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 font-montserrat">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <Header title="Test Authentification" />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl px-8">
          {alert && (
            <Alert 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert(null)}
            />
          )}

          {user ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl text-black font-lusitana mb-4">Utilisateur connecté</h2>
                <p className="text-sm text-gray-600 font-montserrat">Informations de votre session JWT</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-xs font-montserrat text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-lg font-istok-web text-black">{user.email}</p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <p className="text-xs font-montserrat text-gray-500 uppercase mb-1">Nom complet</p>
                  <p className="text-lg font-istok-web text-black">{user.prenom} {user.nom}</p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <p className="text-xs font-montserrat text-gray-500 uppercase mb-1">Type de compte</p>
                  <p className="text-lg font-istok-web text-black capitalize">{user.accountType}</p>
                </div>

                <div>
                  <p className="text-xs font-montserrat text-gray-500 uppercase mb-1">ID Utilisateur</p>
                  <p className="text-lg font-istok-web text-black">{user.userId}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handleLogout}
                  className="flex-1"
                >
                  Se déconnecter
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="link"
                  className="flex-1"
                >
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl text-black font-lusitana mb-4">Non authentifié</h2>
              <p className="text-gray-600 font-montserrat mb-6">Vous devez vous connecter pour accéder à cette page.</p>
              <Button onClick={() => window.location.href = '/login'}>
                Se connecter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
