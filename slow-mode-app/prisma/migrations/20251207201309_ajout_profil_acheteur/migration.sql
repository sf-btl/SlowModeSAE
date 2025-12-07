/*
  Warnings:

  - You are about to drop the column `id_commande` on the `acheteurs` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `commandes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_user]` on the table `acheteurs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user]` on the table `fournisseurs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_user` to the `acheteurs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_acheteur` to the `commandes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `fournisseurs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatutCommande" ADD VALUE 'CONFIRMEE';
ALTER TYPE "StatutCommande" ADD VALUE 'PRETE';
ALTER TYPE "StatutCommande" ADD VALUE 'EXPEDIEE';
ALTER TYPE "StatutCommande" ADD VALUE 'LIVREE';

-- DropForeignKey
ALTER TABLE "acheteurs" DROP CONSTRAINT "acheteurs_id_commande_fkey";

-- DropForeignKey
ALTER TABLE "commandes" DROP CONSTRAINT "commandes_id_user_fkey";

-- DropIndex
DROP INDEX "acheteurs_id_commande_key";

-- AlterTable
ALTER TABLE "acheteurs" DROP COLUMN "id_commande",
ADD COLUMN     "allergies_textiles" TEXT,
ADD COLUMN     "id_user" TEXT NOT NULL,
ADD COLUMN     "notes_preferences" TEXT,
ADD COLUMN     "preferences_style" TEXT,
ADD COLUMN     "taille_habituelle" TEXT;

-- AlterTable
ALTER TABLE "commandes" DROP COLUMN "id_user",
ADD COLUMN     "date_livraison_souhaitee" TIMESTAMP(3),
ADD COLUMN     "id_acheteur" TEXT NOT NULL,
ADD COLUMN     "instructions_speciales" TEXT,
ADD COLUMN     "mensurations_specifiques" TEXT,
ADD COLUMN     "nom_destinataire" TEXT,
ADD COLUMN     "notes_client" TEXT,
ADD COLUMN     "notes_mensurations" TEXT;

-- AlterTable
ALTER TABLE "commandes_tissus" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "couturiers" ADD COLUMN     "conditions" TEXT,
ADD COLUMN     "portfolio_url" TEXT,
ADD COLUMN     "specialites" TEXT;

-- AlterTable
ALTER TABLE "fournisseurs" ADD COLUMN     "adresse_entreprise" TEXT,
ADD COLUMN     "conditions_livraison" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "id_user" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lignes_commande" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "patrons" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image_apercu" TEXT,
ADD COLUMN     "tailles_incluses" TEXT,
ADD COLUMN     "temps_realisation" TEXT;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "contenu_libre" TEXT,
ADD COLUMN     "tags" TEXT;

-- AlterTable
ALTER TABLE "produits" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "tissus" ADD COLUMN     "composition" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "entretien" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "motif" TEXT;

-- AlterTable
ALTER TABLE "utilisateurs" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "telephone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "acheteurs_id_user_key" ON "acheteurs"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "fournisseurs_id_user_key" ON "fournisseurs"("id_user");

-- AddForeignKey
ALTER TABLE "acheteurs" ADD CONSTRAINT "acheteurs_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "utilisateurs"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fournisseurs" ADD CONSTRAINT "fournisseurs_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "utilisateurs"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_acheteur_fkey" FOREIGN KEY ("id_acheteur") REFERENCES "acheteurs"("id_acheteur") ON DELETE CASCADE ON UPDATE CASCADE;
