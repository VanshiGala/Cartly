/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeProductId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stripeProductId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_stripeProductId_key" ON "Product"("stripeProductId");
