-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "produitId" INTEGER,
ADD COLUMN     "tissuId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tissuId_fkey" FOREIGN KEY ("tissuId") REFERENCES "Tissu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
