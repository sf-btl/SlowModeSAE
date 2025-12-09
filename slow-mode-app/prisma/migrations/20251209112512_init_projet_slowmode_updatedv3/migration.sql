/*
  Warnings:

  - You are about to drop the column `fournisseurId` on the `Tissu` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tissu" DROP CONSTRAINT "Tissu_fournisseurId_fkey";

-- AlterTable
ALTER TABLE "Tissu" DROP COLUMN "fournisseurId";

-- CreateTable
CREATE TABLE "_FournisseurToTissu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FournisseurToTissu_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FournisseurToTissu_B_index" ON "_FournisseurToTissu"("B");

-- AddForeignKey
ALTER TABLE "_FournisseurToTissu" ADD CONSTRAINT "_FournisseurToTissu_A_fkey" FOREIGN KEY ("A") REFERENCES "Fournisseur"("utilisateurId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FournisseurToTissu" ADD CONSTRAINT "_FournisseurToTissu_B_fkey" FOREIGN KEY ("B") REFERENCES "Tissu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
