// Utilitaires pour la validation des tokens de réinitialisation de mot de passe

// Liste centralisée des tokens valides (simulation)
// Dans un vrai projet, ceci serait remplacé par des requêtes en base de données
const VALID_TOKENS = [
  'valid-token-123',
  'reset-abc456',
  'user-reset-789',
  'test-token'
]

/**
 * Vérifie si un token de réinitialisation est valide
 * @param token - Le token à vérifier
 * @returns true si le token est valide, false sinon
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false

  // Dans un vrai projet, vous feriez quelque chose comme :
  // const tokenData = await db.passwordResetToken.findUnique({
  //   where: { 
  //     token: token,
  //     expiresAt: { gt: new Date() }
  //   }
  // })
  // return !!tokenData

  return VALID_TOKENS.includes(token)
}

/**
 * Vérifie si un token de réinitialisation est expiré
 * @param token - Le token à vérifier
 * @returns true si le token est expiré, false sinon
 */
export function isTokenExpired(token: string): boolean {
  // Simulation d'un token expiré
  return token === 'expired-token'
}

/**
 * Valide un token de réinitialisation avec toutes les vérifications
 * @param token - Le token à valider
 * @returns Objet avec le statut de validation et un message d'erreur si applicable
 */
export function validateResetToken(token: string | null): {
  valid: boolean
  error?: string
} {
  if (!token) {
    return { valid: false, error: 'Token manquant' }
  }

  if (isTokenExpired(token)) {
    return { valid: false, error: 'Token expiré' }
  }

  if (!isTokenValid(token)) {
    return { valid: false, error: 'Token invalide ou expiré' }
  }

  return { valid: true }
}