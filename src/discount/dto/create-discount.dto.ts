import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  productId: number;

  @ApiProperty({
    type: Date,
    description: 'This is a required property',
  })
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: 'This is a required property',
  })
  endDate: Date;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  value: number;
}
