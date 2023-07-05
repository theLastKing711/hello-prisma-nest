import { Invoice, InvoiceDetails, Prisma } from '@prisma/client';

export class CreateInvoiceDto {
  invoiceDetails: CreateInvoiceDetails[];
  appUserId: number;
}

class CreateInvoiceDetails {
  productId: number;
  productQuantity: number;
}
