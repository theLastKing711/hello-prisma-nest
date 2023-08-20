-- AlterTable
ALTER TABLE "AppUser" ALTER COLUMN "imagePath" DROP NOT NULL,
ALTER COLUMN "cloudinary_public_id" DROP NOT NULL;
