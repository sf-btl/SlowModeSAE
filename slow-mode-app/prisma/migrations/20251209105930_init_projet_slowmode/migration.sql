-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "adresse_postale" TEXT,
    "ville" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acheteur" (
    "utilisateurId" INTEGER NOT NULL,
    "mensurations" TEXT,

    CONSTRAINT "Acheteur_pkey" PRIMARY KEY ("utilisateurId")
);

-- CreateTable
CREATE TABLE "Couturier" (
    "utilisateurId" INTEGER NOT NULL,
    "bio_description" TEXT,
    "annees_experience" INTEGER,
    "note_moyenne" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Couturier_pkey" PRIMARY KEY ("utilisateurId")
);

-- CreateTable
CREATE TABLE "Fournisseur" (
    "utilisateurId" INTEGER NOT NULL,
    "siret" TEXT NOT NULL,
    "nom_societe" TEXT NOT NULL,
    "note_moyenne" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Fournisseur_pkey" PRIMARY KEY ("utilisateurId")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "adresse_livraison" TEXT NOT NULL,
    "montant_total" DOUBLE PRECISION NOT NULL,
    "acheteurId" INTEGER NOT NULL,
    "couturierId" INTEGER,
    "fournisseurId" INTEGER,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "nom_produit" TEXT NOT NULL,
    "description" TEXT,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patron" (
    "id" SERIAL NOT NULL,
    "nom_patron" TEXT NOT NULL,
    "difficulte" INTEGER,
    "prix_digital" DOUBLE PRECISION NOT NULL,
    "fichier_pdf" TEXT NOT NULL,
    "couturierId" INTEGER NOT NULL,

    CONSTRAINT "Patron_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "titre_creation" TEXT NOT NULL,
    "date_publication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "photo_resultat" TEXT,
    "couturierId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tissu" (
    "id" SERIAL NOT NULL,
    "matiere" TEXT NOT NULL,
    "grammage" INTEGER,
    "couleur" TEXT NOT NULL,
    "metrage_dispo" DOUBLE PRECISION NOT NULL,
    "fournisseurId" INTEGER NOT NULL,

    CONSTRAINT "Tissu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FournisseurToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FournisseurToPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CommandeToProduit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CommandeToProduit_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Fournisseur_siret_key" ON "Fournisseur"("siret");

-- CreateIndex
CREATE INDEX "_FournisseurToPost_B_index" ON "_FournisseurToPost"("B");

-- CreateIndex
CREATE INDEX "_CommandeToProduit_B_index" ON "_CommandeToProduit"("B");

-- AddForeignKey
ALTER TABLE "Acheteur" ADD CONSTRAINT "Acheteur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couturier" ADD CONSTRAINT "Couturier_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fournisseur" ADD CONSTRAINT "Fournisseur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_acheteurId_fkey" FOREIGN KEY ("acheteurId") REFERENCES "Acheteur"("utilisateurId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_couturierId_fkey" FOREIGN KEY ("couturierId") REFERENCES "Couturier"("utilisateurId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("utilisateurId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patron" ADD CONSTRAINT "Patron_couturierId_fkey" FOREIGN KEY ("couturierId") REFERENCES "Couturier"("utilisateurId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_couturierId_fkey" FOREIGN KEY ("couturierId") REFERENCES "Couturier"("utilisateurId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tissu" ADD CONSTRAINT "Tissu_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("utilisateurId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FournisseurToPost" ADD CONSTRAINT "_FournisseurToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Fournisseur"("utilisateurId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FournisseurToPost" ADD CONSTRAINT "_FournisseurToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommandeToProduit" ADD CONSTRAINT "_CommandeToProduit_A_fkey" FOREIGN KEY ("A") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommandeToProduit" ADD CONSTRAINT "_CommandeToProduit_B_fkey" FOREIGN KEY ("B") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
