'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { PasswordIcon } from '@/components/Icons'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null) // null = en cours de validation
  
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  // Validation du token côté backend dès le chargement de la page
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        return
      }

      try {
        // Appel à l'API de validation du token
        const response = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`)
        const data = await response.json()

        setTokenValid(data.valid)
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error)
        setTokenValid(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (!token) {
      setError('Token de réinitialisation manquant ou invalide')
      setLoading(false)
      return
    }

    try {
      // Appel à l'API de réinitialisation
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation')
      }
      
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la réinitialisation')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    window.location.href = '/login'
  }

  // Affichage de chargement pendant la validation du token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-white relative">
        <Header title="Vérification..." onBack={handleBackToLogin} />
        <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md px-8">
            <div className="text-center space-y-6">
              <div className="text-left">
                <h2 className="text-2xl text-black font-lusitana mb-4">Vérification du lien...</h2>
                <div className="flex justify-center">
                  <svg className="animate-spin h-8 w-8 text-cyan-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!token || tokenValid === false) {
    return (
      <div className="min-h-screen bg-white relative">
        <Header title="Lien invalide" onBack={handleBackToLogin} />
        <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md px-8">
            <div className="text-center space-y-6">
              <div className="text-left">
                <h2 className="text-2xl text-black font-lusitana mb-4">Lien invalide</h2>
                <p className="text-zinc-600 font-montserrat text-sm mb-8">
                  Le lien de réinitialisation est invalide ou a expiré.
                </p>
              </div>
              <div className="mb-6">
                <Link 
                  href="/forgot-password" 
                  className="w-full bg-cyan-950 text-white py-3 px-4 rounded-2xl hover:bg-cyan-950/95 transition-colors font-lusitana text-lg cursor-pointer inline-block text-center"
                >
                  Demander un nouveau lien
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white relative">
        <Header title="Succès" onBack={handleBackToLogin} />
        <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md px-8">
            <div className="text-center space-y-6">
              {/* Icône de validation */}
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="text-left">
                <h2 className="text-2xl text-black font-lusitana mb-4">Mot de passe mis à jour</h2>
                <p className="text-zinc-600 font-montserrat text-sm mb-8">
                  Votre mot de passe a été réinitialisé avec succès.
                </p>
              </div>
              
              <div className="mb-6">
                <Link 
                  href="/login" 
                  className="w-full bg-cyan-950 text-white py-3 px-4 rounded-2xl hover:bg-cyan-950/95 transition-colors font-lusitana text-lg cursor-pointer inline-block text-center"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      <Header title="Nouveau mot de passe" onBack={handleBackToLogin} />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md px-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Titre du formulaire */}
            <div className="text-left">
              <h2 className="text-2xl text-black font-lusitana mb-6">Nouveau mot de passe</h2>
            </div>

            {/* Champ Nouveau mot de passe */}
            <div className="relative mb-10">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <PasswordIcon className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-3 pr-10 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 ${
                  error ? 'focus:ring-rose-800/80 ring-1 ring-rose-800' : 'focus:ring-zinc-500'
                }`}
                placeholder="Nouveau mot de passe"
                minLength={6}
              />
            </div>

            {/* Champ Confirmer le mot de passe */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <PasswordIcon className="w-5 h-5" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-3 pr-10 py-2 text-black font-montserrat bg-input-bg border-0 rounded-md focus:outline-none focus:ring-2 ${
                  error ? 'focus:ring-rose-800/80 ring-1 ring-rose-800' : 'focus:ring-zinc-500'
                }`}
                placeholder="Confirmez le mot de passe"
                minLength={6}
              />
            </div>

            {/* Zone d'erreur avec hauteur fixe */}
            <div className="h-6 mb-6">
              {error && (
                <div className="text-rose-800 text-xs sm:text-sm font-montserrat">
                  {error}
                </div>
              )}
            </div>

            {/* Bouton de mise à jour */}
            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-950 text-white py-3 px-4 rounded-2xl hover:bg-cyan-950/95 transition-colors font-lusitana text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </div>

            {/* Retour à la connexion */}
            <div className="text-left mb-0">
              <span className="text-medium font-lusitana text-black">
                Vous vous souvenez ?
              </span>
            </div>

            <div className="text-right">
              <Link 
                href="/login" 
                className="text-sm/9 font-bold font-istok-web text-cyan-950 hover:text-cyan-950/80 transition-colors"
              >
                SE CONNECTER
              </Link>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}