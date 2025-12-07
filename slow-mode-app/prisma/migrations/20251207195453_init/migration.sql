/*
  Warnings:

  - You are about to drop the column `id_produit` on the `commandes` table. All the data in the column will be lost.
  - Made the column `id_couturier` on table `commandes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "commandes" DROP CONSTRAINT "commandes_id_couturier_fkey";

-- DropForeignKey
ALTER TABLE "commandes" DROP CONSTRAINT "commandes_id_produit_fkey";

-- AlterTable
ALTER TABLE "commandes" DROP COLUMN "id_produit",
ALTER COLUMN "id_couturier" SET NOT NULL;

-- AlterTable
ALTER TABLE "tissus" ADD COLUMN     "prix_metre" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "lignes_commande" (
    "id_ligne" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_commande" TEXT NOT NULL,
    "id_produit" TEXT NOT NULL,

    CONSTRAINT "lignes_commande_pkey" PRIMARY KEY ("id_ligne")
);

-- CreateTable
CREATE TABLE "commandes_tissus" (
    "id_commande_tissu" TEXT NOT NULL,
    "quantite_metre" DECIMAL(10,2) NOT NULL,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_commande" TEXT NOT NULL,
    "id_tissu" TEXT NOT NULL,

    CONSTRAINT "commandes_tissus_pkey" PRIMARY KEY ("id_commande_tissu")
);

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_couturier_fkey" FOREIGN KEY ("id_couturier") REFERENCES "couturiers"("id_couturier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_commande" ADD CONSTRAINT "lignes_commande_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "commandes"("id_commande") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_commande" ADD CONSTRAINT "lignes_commande_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "produits"("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes_tissus" ADD CONSTRAINT "commandes_tissus_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "commandes"("id_commande") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes_tissus" ADD CONSTRAINT "commandes_tissus_id_tissu_fkey" FOREIGN KEY ("id_tissu") REFERENCES "tissus"("id_tissu") ON DELETE RESTRICT ON UPDATE CASCADE;
