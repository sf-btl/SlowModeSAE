/*
  Warnings:

  - You are about to drop the `_FournisseurToTissu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fournisseurId` to the `Tissu` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FournisseurToTissu" DROP CONSTRAINT "_FournisseurToTissu_A_fkey";

-- DropForeignKey
ALTER TABLE "_FournisseurToTissu" DROP CONSTRAINT "_FournisseurToTissu_B_fkey";

-- AlterTable
ALTER TABLE "Tissu" ADD COLUMN     "fournisseurId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_FournisseurToTissu";

-- AddForeignKey
ALTER TABLE "Tissu" ADD CONSTRAINT "Tissu_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("utilisateurId") ON DELETE RESTRICT ON UPDATE CASCADE;
