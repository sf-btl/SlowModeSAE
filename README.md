# SlowMode App 👕

Application Next.js moderne avec configuration Docker pour la production.

## 📋 Prérequis

- **Node.js** 20+ (pour le développement local)
- **Docker** et **Docker Compose** (pour la production)
- **npm** ou **yarn** (gestionnaire de packages)

## 🛠️ Installation et Configuration

### 1. Clone du projet
```bash
git clone https://github.com/sf-btl/SlowModeSAE.git
cd SlowModeSAE
```

### 2. Installation des dépendances
```bash
cd slow-mode-app
npm install
```

### 3. Configuration de la base de données

#### Variables d'environnement
Créez un fichier `.env` dans `slow-mode-app/` :
```env
DATABASE_URL="postgresql://slowmode_user:votre_password@localhost:5432/slowmode_db"
JWT_SECRET="votre_secret_jwt_tres_securise_changez_moi"
```

#### Installation et configuration PostgreSQL
1. **Installez PostgreSQL** sur votre machine
2. **Créez la base de données** :
```bash
psql -U postgres
CREATE DATABASE slowmode_db;
CREATE USER slowmode_user WITH PASSWORD 'votre_password';
GRANT ALL PRIVILEGES ON DATABASE slowmode_db TO slowmode_user;
\q
```

#### Migration de la base de données avec Prisma
```bash
cd slow-mode-app

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Ou créer une nouvelle migration après modification du schéma
npx prisma migrate dev --name nom_de_la_migration
```

#### Visualiser la base de données
```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

## 🧑‍💻 Développement Local

### Démarrage en mode développement
```bash
cd slow-mode-app
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

### Fonctionnalités de développement
- ✅ **Turbopack** activé pour des builds ultra-rapides
- ✅ **Hot-reload** automatique
- ✅ **React Compiler** pour des performances optimisées
- ✅ **TypeScript** support complet
- ✅ **TailwindCSS** pour le styling
- ✅ **ESLint** pour la qualité du code

### Scripts disponibles
```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build de production
npm run start    # Démarrage en mode production
npm run lint     # Vérification du code
```

### 🗄️ Utilisation de Prisma dans le projet

#### Commandes Prisma essentielles

```bash
# Générer le client Prisma après modification du schéma
npx prisma generate

# Créer une migration en mode développement
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

#### Structure de la base de données
Le schéma Prisma (`prisma/schema.prisma`) définit 4 modèles principaux :
- **Utilisateur** : Table de base pour tous les utilisateurs
- **Acheteur** : Particuliers (relation 1:1 avec Utilisateur)
- **Couturier** : Professionnels créateurs (relation 1:1 avec Utilisateur)
- **Fournisseur** : Entreprises (relation 1:1 avec Utilisateur)

#### Client Prisma singleton
Le client Prisma est configuré avec l'adaptateur PostgreSQL pour Prisma 7 :
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
```

#### Exemples d'utilisation

**Créer un utilisateur acheteur** :
```typescript
const user = await prisma.utilisateur.create({
  data: {
    email: 'user@example.com',
    mot_de_passe: hashedPassword,
    nom: 'Dupont',
    prenom: 'Jean',
    acheteur: {
      create: {}
    }
  },
  include: {
    acheteur: true
  }
});
```

**Créer un couturier** :
```typescript
const couturier = await prisma.utilisateur.create({
  data: {
    email: 'couturier@example.com',
    mot_de_passe: hashedPassword,
    nom: 'Martin',
    prenom: 'Sophie',
    couturier: {
      create: {}
    }
  },
  include: {
    couturier: true
  }
});
```

**Créer un fournisseur** :
```typescript
const fournisseur = await prisma.utilisateur.create({
  data: {
    email: 'contact@entreprise.com',
    mot_de_passe: hashedPassword,
    nom: 'Entreprise SAS',
    prenom: '',
    fournisseur: {
      create: {
        siret: '12345678901234',
        nom_societe: 'Entreprise SAS'
      }
    }
  },
  include: {
    fournisseur: true
  }
});
```

**Récupérer un utilisateur avec son type** :
```typescript
const user = await prisma.utilisateur.findUnique({
  where: { email: 'user@example.com' },
  include: {
    acheteur: true,
    couturier: true,
    fournisseur: true
  }
});

// Déterminer le type de compte
if (user.acheteur) console.log('Acheteur');
if (user.couturier) console.log('Couturier');
if (user.fournisseur) console.log('Fournisseur');
```

### 🔐 Système d'authentification

#### Bibliothèques utilisées
- **jsonwebtoken** : Création et vérification des JWT
- **crypto (Node.js natif)** : Hashing sécurisé des mots de passe avec scrypt
- **@prisma/adapter-pg** + **pg** : Adaptateur PostgreSQL pour Prisma 7

#### Fonctionnalités d'authentification

**Utilitaires disponibles** (`src/lib/auth.ts`) :
```typescript
import { createToken, verifyToken, setAuthCookie, getCurrentUser } from '@/lib/auth';

// Créer un JWT
const token = await createToken({
  userId: user.id,
  email: user.email,
  nom: user.nom,
  prenom: user.prenom,
  accountType: 'acheteur'
});

// Définir le cookie d'authentification
await setAuthCookie(token);

// Récupérer l'utilisateur connecté
const currentUser = await getCurrentUser();

// Vérifier un token
const payload = await verifyToken(token);
```

**Context React pour l'authentification** :
```typescript
// Dans un composant client
import { useAuth } from '@/components/AuthProvider';

function MyComponent() {
  const { user, loading, error, logout } = useAuth();

  if (loading) return <Loading />;
  if (error) return <div>Erreur: {error}</div>;
  if (!user) return <div>Non connecté</div>;

  return (
    <div>
      <p>Bienvenue {user.prenom} {user.nom}</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

#### Protection des routes
Le fichier `src/proxy.ts` protège automatiquement toutes les routes sauf :
- `/` (page d'accueil)
- `/login` et `/register`
- `/forgot-password` et `/reset-password`
- `/api/login` et `/api/register`

**Désactiver temporairement la protection** :
```typescript
// src/proxy.ts
const AUTH_ENABLED = false; // Mettre à false pour désactiver
```

#### Endpoints API disponibles

- **POST /api/register** : Création de compte (acheteur/couturier/fournisseur)
- **POST /api/login** : Connexion et création du JWT
- **POST /api/logout** : Déconnexion et suppression du cookie
- **GET /api/me** : Récupération de l'utilisateur connecté
- **POST /api/refresh** : Rafraîchissement du token JWT

#### Sécurité des mots de passe
Les mots de passe sont hashés avec **crypto.scrypt** (Node.js natif) :
```typescript
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Hashing
const salt = randomBytes(16).toString('hex');
const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
const hashedPassword = `${salt}:${derivedKey.toString('hex')}`;

// Vérification
const [salt, hash] = storedPassword.split(':');
const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
const isValid = hash === derivedKey.toString('hex');
```

## 🐳 Production avec Docker

### Architecture Docker
- **Multi-stage build** optimisé
- **Image Alpine Linux** légère
- **Utilisateur non-root** pour la sécurité
- **Build standalone** Next.js pour de meilleures performances

### Déploiement en production

#### 1. Construction de l'image
```bash
docker-compose build slow-mode-prod
```

#### 2. Démarrage du conteneur
```bash
docker-compose up slow-mode-prod
```

#### 3. Démarrage en arrière-plan
```bash
docker-compose up -d slow-mode-prod
```

L'application de production sera accessible sur **http://localhost:3000**

### Commandes Docker utiles

```bash
# Voir les conteneurs en cours d'exécution
docker ps

# Arrêter l'application
docker-compose down

# Reconstruction complète (sans cache)
docker-compose build --no-cache slow-mode-prod

# Voir les logs
docker-compose logs slow-mode-prod

# Suivre les logs en temps réel
docker-compose logs -f slow-mode-prod
```

### Mise à jour de l'application en production

1. **Modifier votre code**
2. **Arrêter le conteneur actuel** :
   ```bash
   docker-compose down
   ```
3. **Reconstruire l'image** :
   ```bash
   docker-compose build slow-mode-prod
   ```
4. **Redémarrer l'application** :
   ```bash
   docker-compose up -d slow-mode-prod
   ```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` dans le dossier `slow-mode-app/` :

```bash
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

Pour la production avec Docker, les variables sont définies dans `docker-compose.yml`.

### Next.js Configuration

Le fichier `next.config.ts` est configuré pour :
- **React Compiler** activé
- **Output standalone** pour Docker
- **Optimisations** des packages importés

## 🚨 Troubleshooting

### Problèmes courants

#### Le conteneur ne démarre pas
```bash
# Vérifiez les logs
docker-compose logs slow-mode-prod

# Vérifiez l'état des conteneurs
docker ps -a
```

#### Erreur de build
```bash
# Nettoyez les images Docker
docker system prune -a

# Reconstruisez sans cache
docker-compose build --no-cache
```

#### Port déjà utilisé
```bash
# Changez le port dans docker-compose.yml
ports:
  - "3001:3000"  # Au lieu de 3000:3000
```

## 📚 Technologies Utilisées

### Frontend
- **Next.js 16** avec App Router
- **React 19** avec React Compiler
- **TypeScript** pour le typage statique
- **TailwindCSS** pour le styling

### Backend & Base de données
- **Prisma 7.1.0** : ORM avec adaptateur PostgreSQL
- **PostgreSQL** : Base de données relationnelle
- **@prisma/adapter-pg** + **pg** : Adaptateur pour Prisma 7

### Authentification
- **jsonwebtoken** : Gestion des JWT (tokens d'authentification)
- **crypto (Node.js)** : Hashing des mots de passe avec scrypt
- **Cookies HTTPOnly** : Stockage sécurisé des tokens

### DevOps
- **Docker** pour la containerisation
- **ESLint** pour la qualité du code

## 🔄 Workflow de développement

### 1. Modifier le schéma de base de données
```bash
# Éditer prisma/schema.prisma
# Puis créer la migration
npx prisma migrate dev --name description_changement
```

### 2. Régénérer le client Prisma
```bash
npx prisma generate
```

### 3. Tester avec Prisma Studio
```bash
npx prisma studio
```

### 4. Développer les fonctionnalités
```bash
npm run dev
```

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence "All Rights Reserved". Voir le fichier `LICENSE` pour plus de détails.