/*
  Warnings:

  - You are about to drop the column `Roles` on the `AppUser` table. All the data in the column will be lost.
  - Added the required column `role` to the `AppUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "Roles",
ADD COLUMN     "role" "Role" NOT NULL;
