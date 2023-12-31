import { ApiProperty } from '@nestjs/swagger';

class CreateInvoiceDetails {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  productId: number;
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  productQuantity: number;
}
export class CreateInvoiceDto {
  @ApiProperty({
    isArray: true,
    type: CreateInvoiceDetails,
    description: 'This is a required property',
  })
  invoiceDetails: CreateInvoiceDetails[];

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  appUserId: number;
}
