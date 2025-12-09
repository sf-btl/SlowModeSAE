/*
  Warnings:

  - You are about to drop the column `difficulte` on the `Patron` table. All the data in the column will be lost.
  - You are about to drop the column `prix_digital` on the `Patron` table. All the data in the column will be lost.
  - Made the column `couturierId` on table `Commande` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_couturierId_fkey";

-- AlterTable
ALTER TABLE "Commande" ALTER COLUMN "couturierId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Patron" DROP COLUMN "difficulte",
DROP COLUMN "prix_digital";

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_couturierId_fkey" FOREIGN KEY ("couturierId") REFERENCES "Couturier"("utilisateurId") ON DELETE RESTRICT ON UPDATE CASCADE;
