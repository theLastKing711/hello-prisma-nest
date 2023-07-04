import { Invoice } from '@prisma/client';
import { CreateInvoiceDetails } from 'src/invoice-details/dto/create-invoice-details.dto';

export class CreateInvoiceDto {
  // invoiceDetails: CreateInvoiceDetails[];
  appUserId: Invoice['appUserId'];
}
