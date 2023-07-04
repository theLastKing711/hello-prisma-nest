import { Prisma } from '@prisma/client';

export class ResponseInvoiceDto {
  id: number;
  createdAt: Date;
  appUserId: number;
  appUser: {
    userName: string;
  };
  invoiceDetails: {
    id: number;
    createdAt: Date;
    invoiceId: number;
    ProductQuantity: number;
    productId: number;
    product: {
      name: string;
      price: Prisma.Decimal;
    };
  }[];
}
