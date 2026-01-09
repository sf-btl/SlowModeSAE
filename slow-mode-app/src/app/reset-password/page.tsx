'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { PasswordIcon } from '@/components/Icons'

// Composant qui utilise useSearchParams - doit être dans Suspense
function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        return
      }

      try {
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

  if (tokenValid === null) {
    return <Loading message="Vérification du lien..." title="Validation" />
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
                <Button onClick={() => window.location.href = '/forgot-password'}>
                  Demander un nouveau lien
                </Button>
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
                <Button onClick={() => window.location.href = '/login'}>
                  Se connecter
                </Button>
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
            <div className="text-left">
              <h2 className="text-2xl text-black font-lusitana mb-6">Nouveau mot de passe</h2>
            </div>

            <div className="mb-10">
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
            </div>

            <div className="mb-6">
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
            </div>

            <div className="h-6 mb-6">
              {error && (
                <div className="text-rose-800 text-xs sm:text-sm font-montserrat">
                  {error}
                </div>
              )}
            </div>

            <div className="mb-6">
              <Button type="submit" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </Button>
            </div>

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

// Composant principal avec Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading message="Chargement..." title="Reset Password" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}