/*
  Warnings:

  - You are about to drop the column `EndDate` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `StartDate` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `ProductQuantity` on the `InvoiceDetails` table. All the data in the column will be lost.
  - Added the required column `productQuantity` to the `InvoiceDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "EndDate",
DROP COLUMN "StartDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InvoiceDetails" DROP COLUMN "ProductQuantity",
ADD COLUMN     "productQuantity" INTEGER NOT NULL;
