-- CreateTable
CREATE TABLE "ProductFavourite" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,
    "appUserId" INTEGER NOT NULL,

    CONSTRAINT "ProductFavourite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductFavourite" ADD CONSTRAINT "ProductFavourite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFavourite" ADD CONSTRAINT "ProductFavourite_appUserId_fkey" FOREIGN KEY ("appUserId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
