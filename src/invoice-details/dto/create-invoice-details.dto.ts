import { InvoiceDetails } from '@prisma/client';
export type CreateInvoiceDetails = Omit<InvoiceDetails, 'id'>;
