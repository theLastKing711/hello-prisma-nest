/*
  Warnings:

  - Added the required column `cloudinary_public_id` to the `AppUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppUser" ADD COLUMN     "cloudinary_public_id" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'Admin';
