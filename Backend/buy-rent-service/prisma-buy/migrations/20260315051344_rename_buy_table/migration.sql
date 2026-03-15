/*
  Warnings:

  - You are about to drop the column `image_url` on the `BuyProducts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BuyProducts" DROP COLUMN "image_url",
ADD COLUMN     "image_urls" TEXT[];
