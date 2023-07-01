/*
  Warnings:

  - You are about to drop the column `fullImagePath` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `thumbImagePath` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "fullImagePath",
DROP COLUMN "thumbImagePath";
