import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise_changez_moi';

export interface JWTPayload {
  userId: number;
  email: string;
  accountType: string;
  nom: string;
  prenom: string;
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token valide 7 jours
  });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload & { exp: number };
    return decoded;
  } catch (error) {
    console.error('Token invalide:', error);
    return null;
  }
}

export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as { exp: number } | null;
    return decoded?.exp ? decoded.exp * 1000 : null; // Convertir en millisecondes
  } catch (error) {
    console.error('Impossible de décoder le token:', error);
    return null;
  }
}

export function shouldRefreshToken(token: string): boolean {
  const exp = getTokenExpiration(token);
  if (!exp) return false;
  
  const now = Date.now();
  const timeUntilExpiry = exp - now;
  const oneDayInMs = 24 * 60 * 60 * 1000;
  
  // Refresh si moins de 1 jour avant expiration
  return timeUntilExpiry < oneDayInMs;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  return token?.value || null;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}
