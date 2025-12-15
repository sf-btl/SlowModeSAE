/*
  Warnings:

  - Added the required column `imagePath` to the `Tissu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prix_unitaire` to the `Tissu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tissu" ADD COLUMN     "imagePath" TEXT NOT NULL,
ADD COLUMN     "prix_unitaire" DOUBLE PRECISION NOT NULL;
