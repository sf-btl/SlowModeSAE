/*
  Warnings:

  - Added the required column `couturierId` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "couturierId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_couturierId_fkey" FOREIGN KEY ("couturierId") REFERENCES "Couturier"("utilisateurId") ON DELETE RESTRICT ON UPDATE CASCADE;
