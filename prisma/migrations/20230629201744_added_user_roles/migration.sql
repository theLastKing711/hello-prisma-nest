-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "AppUser" ADD COLUMN     "Roles" "Role"[];
