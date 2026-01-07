"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface UserData {
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  accountType: string;
  adresse_postale?: string;
  ville?: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTokenIfNeeded = async () => {
    try {
      await fetch('/api/refresh', { method: 'POST' });
    } catch (err) {
      console.error('Erreur lors du refresh du token:', err);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/me');
      const result = await response.json();

      if (result.success) {
        // Ajout d'une compatibilité pour l'adresse postale et la ville
        setUser({
          ...result.data,
          adresse_postale: result.data.adresse_postale || '',
          ville: result.data.ville || '',
        });
        // Vérifier si le token doit être rafraîchi
        await refreshTokenIfNeeded();
      } else {
        setUser(null);
        setError(result.message || 'Non authentifié');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err);
      setUser(null);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, refetch: fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
