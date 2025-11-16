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

- **Next.js 16** avec App Router
- **React 19** avec React Compiler
- **TypeScript** pour le typage statique
- **TailwindCSS** pour le styling
- **Docker** pour la containerisation
- **ESLint** pour la qualité du code

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence "All Rights Reserved". Voir le fichier `LICENSE` pour plus de détails.