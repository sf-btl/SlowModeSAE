-- CreateEnum
CREATE TYPE "CommandeType" AS ENUM ('PRODUIT', 'PROJET');

-- CreateEnum
CREATE TYPE "TypeProjet" AS ENUM ('CREATION', 'RETOUCHE');

-- CreateEnum
CREATE TYPE "CategorieVetement" AS ENUM ('TOPS', 'BOTTOMS', 'FULL_BODY', 'OUTERWEAR', 'LINGERIE', 'ACCESSORIES');

-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "type" "CommandeType" NOT NULL DEFAULT 'PRODUIT';

-- CreateTable
CREATE TABLE "ProjetCommande" (
    "id" SERIAL NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "typeProjet" "TypeProjet" NOT NULL,
    "categorie" "CategorieVetement" NOT NULL,
    "tissuId" INTEGER,
    "description" TEXT,
    "images" TEXT[],
    "mensurations" JSONB NOT NULL,

    CONSTRAINT "ProjetCommande_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjetCommande_commandeId_key" ON "ProjetCommande"("commandeId");

-- AddForeignKey
ALTER TABLE "ProjetCommande" ADD CONSTRAINT "ProjetCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetCommande" ADD CONSTRAINT "ProjetCommande_tissuId_fkey" FOREIGN KEY ("tissuId") REFERENCES "Tissu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
