/*
  Warnings:

  - You are about to drop the `_FournisseurToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_couturierId_fkey";

-- DropForeignKey
ALTER TABLE "_FournisseurToPost" DROP CONSTRAINT "_FournisseurToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_FournisseurToPost" DROP CONSTRAINT "_FournisseurToPost_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "fournisseurId" INTEGER,
ALTER COLUMN "couturierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "imagePath" TEXT;

-- DropTable
DROP TABLE "_FournisseurToPost";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_couturierId_fkey" FOREIGN KEY ("couturierId") REFERENCES "Couturier"("utilisateurId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("utilisateurId") ON DELETE SET NULL ON UPDATE CASCADE;
