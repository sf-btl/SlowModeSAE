# Documentation API - SlowMode SAE

## ⚠️ Avertissement Important

**L'utilisation automatisée, le spam et les requêtes excessives sont strictement interdits.**

Cette API est conçue pour une utilisation humaine raisonnée et responsable. Les pratiques suivantes sont prohibées :
- ❌ Scripts automatisés pour scraper ou collecter des données
- ❌ Requêtes en masse ou flooding
- ❌ Utilisation de bots sans autorisation explicite
- ❌ Toute forme de spam

**Impact écologique** : Chaque requête consomme de l'énergie et des ressources serveur. Une utilisation abusive génère une empreinte carbone inutile et va à l'encontre des valeurs de mode durable que nous défendons.

⚖️ Les abus peuvent entraîner le blocage de votre accès et des poursuites légales.

---

## 📋 Table des matières

1. [Authentification](#authentification)
2. [Utilisateurs](#utilisateurs)
3. [Produits](#produits)
4. [Tissus](#tissus)
5. [Projets](#projets)
6. [Commandes](#commandes)
7. [Annuaire](#annuaire)
8. [Codes de réponse](#codes-de-réponse)

---

## 🔐 Authentification

### Inscription

**Endpoint:** `POST /api/register`

Crée un nouveau compte utilisateur.

**Corps de la requête:**
```json
{
  "accountType": "particulier|entreprise",
  "email": "email@example.com",
  "password": "motdepasse",
  "firstName": "Prénom",
  "lastName": "Nom",
  "adresse_postale": "123 Rue Example",
  "ville": "Paris",
  "phoneNumber": "0612345678",
  "countryCode": "+33"
}
```

Pour un compte entreprise, ajouter :
```json
{
  "companyName": "Nom de la société",
  "siret": "12345678901234"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "user": {
    "id": 1,
    "email": "email@example.com",
    "accountType": "particulier"
  }
}
```

---

### Connexion

**Endpoint:** `POST /api/login`

Authentifie un utilisateur et crée une session.

**Corps de la requête:**
```json
{
  "email": "email@example.com",
  "password": "motdepasse"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "userId": 1,
    "email": "email@example.com",
    "accountType": "couturier",
    "nom": "Dupont",
    "prenom": "Marie"
  }
}
```

**Note:** Un cookie d'authentification est automatiquement créé et doit être inclus dans les requêtes suivantes.

---

### Déconnexion

**Endpoint:** `POST /api/logout`

Déconnecte l'utilisateur et supprime la session.

**Réponse (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### Utilisateur actuel

**Endpoint:** `GET /api/me`

Récupère les informations de l'utilisateur connecté.

**En-têtes requis:**
- Cookie de session (automatique si connecté)

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "email@example.com",
    "accountType": "couturier",
    "nom": "Dupont",
    "prenom": "Marie"
  }
}
```

---

### Réinitialisation de mot de passe

**Endpoint:** `POST /api/reset-password`

Demande de réinitialisation du mot de passe.

**Corps de la requête:**
```json
{
  "email": "email@example.com"
}
```

---

## 👤 Utilisateurs

### Profil utilisateur

**Endpoint:** `GET /api/user/{id}`

Récupère le profil public d'un utilisateur.

**Paramètres:**
- `id` : ID de l'utilisateur

**Réponse (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Marie",
    "email": "email@example.com",
    "ville": "Paris",
    "role": "couturier"
  },
  "posts": [
    {
      "id": 1,
      "titre": "Robe d'été",
      "description": "Belle robe légère",
      "prix": 89.99
    }
  ]
}
```

---

## 🛍️ Produits

### Liste des produits

**Endpoint:** `GET /api/products/feed`

Récupère les produits disponibles (limité à 50).

**Réponse (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "titre": "Robe d'été",
      "description": "Belle robe légère pour l'été",
      "prix": 89.99,
      "quantite_stock": 5,
      "categorie": "ROBES",
      "image_url": "/uploads/image.avif",
      "couturier": {
        "utilisateur": {
          "nom": "Dupont",
          "prenom": "Marie",
          "ville": "Paris"
        }
      }
    }
  ]
}
```

---

### Créer un produit

**Endpoint:** `POST /api/produit`

Crée un nouveau produit (réservé aux couturiers).

**Authentification requise:** Oui (compte couturier)

**Corps de la requête (multipart/form-data):**
```
titre: "Robe d'été"
description: "Belle robe légère"
prix: 89.99
quantite_stock: 5
categorie: "ROBES"
composition: "Coton 100%"
taille: "M"
couleur: "Bleu"
image: [fichier image]
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Produit créé avec succès",
  "produit": {
    "id": 1,
    "titre": "Robe d'été",
    "prix": 89.99
  }
}
```

---

### Stock produit

**Endpoint:** `GET /api/produit/stock?id={productId}`

Récupère le stock d'un produit spécifique.

**Paramètres:**
- `id` : ID du produit

**Réponse (200):**
```json
{
  "success": true,
  "stock": 5
}
```

---

## 🧵 Tissus

### Liste des tissus

**Endpoint:** `GET /api/tissus/feed`

Récupère les tissus disponibles (limité à 50).

**Réponse (200):**
```json
{
  "success": true,
  "tissus": [
    {
      "id": 1,
      "nom": "Lin naturel",
      "composition": "Lin 100%",
      "prix_metre": 15.50,
      "stock_metres": 100,
      "couleur": "Beige",
      "motif": "Uni",
      "image_url": "/uploads/tissus/tissu.avif",
      "fournisseur": {
        "nom_societe": "Tissus Bio",
        "utilisateur": {
          "nom": "Martin",
          "prenom": "Jean"
        }
      }
    }
  ]
}
```

---

### Détails d'un tissu

**Endpoint:** `GET /api/tissu/[id]`

Récupère les détails d'un tissu spécifique.

**Paramètres:**
- `id` : ID du tissu

**Réponse (200):**
```json
{
  "success": true,
  "tissu": {
    "id": 1,
    "nom": "Lin naturel",
    "composition": "Lin 100%",
    "prix_metre": 15.50,
    "stock_metres": 100,
    "couleur": "Beige",
    "motif": "Uni",
    "largeur_cm": 140,
    "poids_grammes_m2": 180,
    "certifications": ["GOTS", "Oeko-Tex"]
  }
}
```

---

### Créer un tissu

**Endpoint:** `POST /api/tissu`

Crée un nouveau tissu (réservé aux fournisseurs).

**Authentification requise:** Oui (compte fournisseur)

**Corps de la requête (multipart/form-data):**
```
nom: "Lin naturel"
composition: "Lin 100%"
prix_metre: 15.50
stock_metres: 100
couleur: "Beige"
motif: "Uni"
largeur_cm: 140
poids_grammes_m2: 180
image: [fichier image]
```

---

## 📐 Projets

### Créer un projet sur mesure

**Endpoint:** `POST /api/projet`

Crée un nouveau projet de création ou retouche.

**Authentification requise:** Oui

**Corps de la requête:**
```json
{
  "mode": "creation",
  "categorie": "tops",
  "couturierId": 5,
  "tissuId": 3,
  "description": "Chemise sur mesure avec col mao",
  "mensurations": {
    "tour_poitrine": "92",
    "tour_taille": "78",
    "tour_hanches": "98",
    "longueur_manche": "60"
  },
  "images": ["/uploads/reference.jpg"]
}
```

**Catégories possibles:**
- `tops` : Hauts
- `bottoms` : Bas
- `full-body` : Corps entier
- `outerwear` : Vêtements d'extérieur
- `lingerie` : Lingerie
- `accessories` : Accessoires

**Modes:**
- `creation` : Création d'une nouvelle pièce
- `retouche` : Retouche d'un vêtement existant

**Réponse (201):**
```json
{
  "success": true,
  "message": "Projet créé avec succès",
  "projet": {
    "id": 1,
    "mode": "creation",
    "categorie": "TOPS",
    "statut": "EN_ATTENTE_DEVIS"
  }
}
```

---

### Upload d'images pour projet

**Endpoint:** `POST /api/projet/upload`

Upload des images de référence pour un projet.

**Authentification requise:** Oui

**Corps de la requête (multipart/form-data):**
```
files: [fichier1.jpg, fichier2.jpg]
```

**Réponse (200):**
```json
{
  "success": true,
  "urls": [
    "/uploads/projet-1-image1.jpg",
    "/uploads/projet-1-image2.jpg"
  ]
}
```

---

## 📦 Commandes

### Liste des commandes

**Endpoint:** `GET /api/commandes`

Récupère les commandes de l'utilisateur connecté.

**Authentification requise:** Oui

**Réponse (200):**
```json
{
  "success": true,
  "commandes": [
    {
      "id": 1,
      "code": "CMD-001",
      "statut": "EN COURS",
      "type": "PRODUIT",
      "progress": 55,
      "montant_total": 89.99,
      "date_commande": "2026-01-09T10:30:00.000Z",
      "acheteur": {
        "utilisateur": {
          "nom": "Durand",
          "prenom": "Sophie",
          "email": "sophie@example.com"
        }
      }
    }
  ]
}
```

**Statuts possibles:**
- `EN ATTENTE VALIDATION` : En attente de validation
- `EN ATTENTE` : En attente de traitement
- `EN COURS` : En cours de fabrication
- `EXPEDIEE` : Expédiée
- `TERMINEE` : Terminée

---

### Détails d'une commande

**Endpoint:** `GET /api/commandes/[id]`

Récupère les détails d'une commande spécifique.

**Authentification requise:** Oui

**Paramètres:**
- `id` : ID de la commande

**Réponse (200):**
```json
{
  "success": true,
  "commande": {
    "id": 1,
    "code": "CMD-001",
    "statut": "EN_COURS",
    "type": "PRODUIT",
    "montant_total": 89.99,
    "date_commande": "2026-01-09T10:30:00.000Z",
    "date_livraison_prevue": "2026-01-20T00:00:00.000Z",
    "adresse_livraison": "123 Rue Example, 75001 Paris"
  }
}
```

---

### Créer une commande

**Endpoint:** `POST /api/commande`

Crée une nouvelle commande (produit ou projet).

**Authentification requise:** Oui

**Corps de la requête:**
```json
{
  "type": "PRODUIT",
  "produitId": 1,
  "quantite": 2,
  "adresse_livraison": "123 Rue Example, 75001 Paris"
}
```

Ou pour un projet :
```json
{
  "type": "PROJET",
  "projetId": 1,
  "adresse_livraison": "123 Rue Example, 75001 Paris"
}
```

---

## 📖 Annuaire

### Liste professionnels

**Endpoint:** `GET /api/annuaire`

Récupère la liste des couturiers et fournisseurs.

**Réponse (200):**
```json
{
  "entries": [
    {
      "id": "1",
      "name": "Marie Dupont",
      "role": "Créateur",
      "rating": 4.5,
      "locationHint": "Paris"
    },
    {
      "id": "2",
      "name": "Tissus Bio SARL",
      "role": "Fournisseur",
      "rating": 4.8,
      "locationHint": "Lyon"
    }
  ],
  "meta": {
    "couturiers": 15,
    "fournisseurs": 8
  }
}
```

---

### Tarifs d'un couturier

**Endpoint:** `GET /api/couturier/prices?id={couturierId}`

Récupère les tarifs d'un couturier pour différents types de créations.

**Paramètres:**
- `id` : ID du couturier

**Réponse (200):**
```json
{
  "success": true,
  "prices": {
    "tops": 45.00,
    "bottoms": 55.00,
    "full-body": 120.00,
    "outerwear": 80.00
  }
}
```

---

### Statistiques du tableau de bord

**Endpoint:** `GET /api/dashboard-stats`

Récupère les statistiques pour le tableau de bord professionnel.

**Authentification requise:** Oui (couturier ou fournisseur)

**Réponse (200):**
```json
{
  "success": true,
  "stats": {
    "totalCommandes": 42,
    "commandesEnCours": 8,
    "chiffreAffaires": 3250.50,
    "noteGlobale": 4.7
  }
}
```

---

## 📌 Codes de réponse

### Codes de succès

- **200 OK** : Requête réussie
- **201 Created** : Ressource créée avec succès

### Codes d'erreur client

- **400 Bad Request** : Données manquantes ou invalides
- **401 Unauthorized** : Authentification requise ou échouée
- **403 Forbidden** : Accès refusé (droits insuffisants)
- **404 Not Found** : Ressource non trouvée

### Codes d'erreur serveur

- **500 Internal Server Error** : Erreur serveur interne

---

## 🔒 Sécurité et bonnes pratiques

### Authentification

- Les cookies de session sont utilisés pour maintenir l'authentification
- Ne partagez jamais vos identifiants
- Les mots de passe sont hachés avec scrypt + salt

### Limites de requêtes

**Respectez ces limites pour une utilisation responsable :**
- Maximum 60 requêtes par minute par utilisateur
- Pas de requêtes automatisées sans autorisation
- Utilisez la mise en cache côté client quand c'est possible

### Upload de fichiers

- Taille maximale : 5 MB par fichier
- Formats acceptés : JPG, PNG, WEBP, AVIF
- Les images sont stockées dans `/public/uploads/`

---

## 🌱 Engagement écologique

Cette plateforme s'inscrit dans une démarche de mode durable. En utilisant cette API :

✅ Privilégiez les requêtes nécessaires uniquement
✅ Mettez en cache les données qui ne changent pas fréquemment
✅ Évitez les doublons de requêtes
✅ Respectez les limites de taux

Chaque requête évitée = moins d'énergie consommée = moins d'impact environnemental.

---

## 📞 Support

Pour toute question ou problème :
- Consultez d'abord cette documentation
- Vérifiez les messages d'erreur retournés
- En cas de besoin, contactez l'équipe de support

**Rappel :** Cette API est conçue pour un usage personnel et responsable. Les abus seront sanctionnés.

---

*Version 1.0*
