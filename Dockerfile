# Production Dockerfile pour SlowMode App
# Utilise Node.js Alpine pour un conteneur léger (version 20 requise pour Next.js 16)
FROM node:20-alpine AS base

# Installation des dépendances nécessaires pour Next.js
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Installation des dépendances
FROM base AS deps
# Copie des fichiers de configuration des dépendances
COPY slow-mode-app/package.json slow-mode-app/package-lock.json* ./
# Installation de toutes les dépendances (dev + prod) pour le build
RUN npm ci && npm cache clean --force

# Stage 2: Build de l'application
FROM base AS builder
WORKDIR /app
# Copie des dépendances depuis le stage précédent
COPY --from=deps /app/node_modules ./node_modules
# Copie du code source
COPY slow-mode-app/ ./

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de l'application Next.js
RUN npm run build

# Stage 3: Image de production finale
FROM base AS runner
WORKDIR /app

# Installation des dépendances de production uniquement
COPY slow-mode-app/package.json slow-mode-app/package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie des fichiers publics
COPY --from=builder /app/public ./public

# Copie des fichiers standalone générés par Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Configuration de l'utilisateur
USER nextjs

# Exposition du port 3000
EXPOSE 3000

# Variables d'environnement de production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Commande de démarrage de l'application
CMD ["node", "server.js"]