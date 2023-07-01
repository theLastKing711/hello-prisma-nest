/*
  Warnings:

  - You are about to drop the column `path` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `AppUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloudinary_public_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudinary_public_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "path",
ADD COLUMN     "cloudinary_public_id" TEXT NOT NULL,
ADD COLUMN     "imagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "path",
ADD COLUMN     "cloudinary_public_id" TEXT NOT NULL,
ADD COLUMN     "imagePath" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_userName_key" ON "AppUser"("userName");
