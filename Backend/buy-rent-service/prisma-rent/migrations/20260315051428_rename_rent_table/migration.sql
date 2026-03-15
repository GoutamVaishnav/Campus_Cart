/*
  Warnings:

  - You are about to drop the column `image_url` on the `RentProducts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RentProducts" DROP COLUMN "image_url",
ADD COLUMN     "image_urls" TEXT[];
