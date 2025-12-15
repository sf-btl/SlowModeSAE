import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Activer/désactiver la protection des routes
const AUTH_ENABLED = false;

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [ '/', '/login', '/register', '/forgot-password', '/reset-password', '/api/login', '/api/register'];

export default async function proxy(request: NextRequest) {
  // Si l'authentification est désactivée, laisser passer
  if (!AUTH_ENABLED) {
    return NextResponse.next();
  }
  const { pathname } = request.nextUrl;

  // Vérifier si la route est publique
  const isPublicRoute = pathname === '/' || publicRoutes.slice(1).some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Pas de token, rediriger vers login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Vérifier la validité du token
  const payload = await verifyToken(token);

  if (!payload) {
    // Token invalide, rediriger vers login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // Token valide, continuer
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
