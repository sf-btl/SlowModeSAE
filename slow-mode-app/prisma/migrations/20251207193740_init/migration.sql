-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'TERMINEE', 'ANNULEE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id_user" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "adresse_postale" TEXT,
    "ville" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "couturiers" (
    "id_couturier" TEXT NOT NULL,
    "bio_description" TEXT,
    "annees_experience" INTEGER,
    "note_moyenne" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "couturiers_pkey" PRIMARY KEY ("id_couturier")
);

-- CreateTable
CREATE TABLE "fournisseurs" (
    "id_fournisseur" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "nom_societe" TEXT NOT NULL,
    "note_moyenne" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fournisseurs_pkey" PRIMARY KEY ("id_fournisseur")
);

-- CreateTable
CREATE TABLE "produits" (
    "id_produit" TEXT NOT NULL,
    "nom_produit" TEXT NOT NULL,
    "description" TEXT,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produits_pkey" PRIMARY KEY ("id_produit")
);

-- CreateTable
CREATE TABLE "tissus" (
    "id_tissu" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,
    "grammage" TEXT,
    "couleur" TEXT,
    "metrage_dispo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_fournisseur" TEXT NOT NULL,

    CONSTRAINT "tissus_pkey" PRIMARY KEY ("id_tissu")
);

-- CreateTable
CREATE TABLE "patrons" (
    "id_patron" TEXT NOT NULL,
    "nom_patron" TEXT NOT NULL,
    "difficulte" TEXT,
    "prix_digital" DECIMAL(10,2),
    "fichier_pdf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_couturier" TEXT NOT NULL,

    CONSTRAINT "patrons_pkey" PRIMARY KEY ("id_patron")
);

-- CreateTable
CREATE TABLE "commandes" (
    "id_commande" TEXT NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "adresse_livraison" TEXT,
    "montant_total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_produit" TEXT NOT NULL,
    "id_couturier" TEXT,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id_commande")
);

-- CreateTable
CREATE TABLE "acheteurs" (
    "id_acheteur" TEXT NOT NULL,
    "mensurations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_commande" TEXT NOT NULL,

    CONSTRAINT "acheteurs_pkey" PRIMARY KEY ("id_acheteur")
);

-- CreateTable
CREATE TABLE "posts" (
    "id_post" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_publication" TIMESTAMP(3),
    "description" TEXT,
    "photo_resultat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id_post")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "couturiers_id_user_key" ON "couturiers"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "fournisseurs_siret_key" ON "fournisseurs"("siret");

-- CreateIndex
CREATE UNIQUE INDEX "acheteurs_id_commande_key" ON "acheteurs"("id_commande");

-- AddForeignKey
ALTER TABLE "couturiers" ADD CONSTRAINT "couturiers_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "utilisateurs"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tissus" ADD CONSTRAINT "tissus_id_fournisseur_fkey" FOREIGN KEY ("id_fournisseur") REFERENCES "fournisseurs"("id_fournisseur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patrons" ADD CONSTRAINT "patrons_id_couturier_fkey" FOREIGN KEY ("id_couturier") REFERENCES "couturiers"("id_couturier") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "utilisateurs"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_couturier_fkey" FOREIGN KEY ("id_couturier") REFERENCES "couturiers"("id_couturier") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acheteurs" ADD CONSTRAINT "acheteurs_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "commandes"("id_commande") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "utilisateurs"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
