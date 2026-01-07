/*
  Warnings:

  - You are about to drop the `_CommandeToProduit` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategorieProduit" AS ENUM ('CHEMISE', 'T_SHIRT', 'PULL', 'VESTE', 'MANTEAU', 'PANTALON', 'JUPE', 'ROBE', 'COMBINAISON', 'ACCESSOIRE', 'AUTRE');

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_couturierId_fkey";

-- DropForeignKey
ALTER TABLE "_CommandeToProduit" DROP CONSTRAINT "_CommandeToProduit_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommandeToProduit" DROP CONSTRAINT "_CommandeToProduit_B_fkey";

-- AlterTable
ALTER TABLE "Commande" ALTER COLUMN "couturierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "categorie" "CategorieProduit" NOT NULL DEFAULT 'AUTRE';

-- DropTable
DROP TABLE "_CommandeToProduit";

-- CreateTable
CREATE TABLE "LigneCommande" (
    "id" SERIAL NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "commandeId" INTEGER NOT NULL,
    "produitId" INTEGER,
    "tissuId" INTEGER,

    CONSTRAINT "LigneCommande_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_couturierId_fkey" FOREIGN KEY ("couturierId") REFERENCES "Couturier"("utilisateurId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_tissuId_fkey" FOREIGN KEY ("tissuId") REFERENCES "Tissu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
