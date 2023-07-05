import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateReviewDto {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  productId: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  appUserId: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  rating: Prisma.Decimal;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  body: string;
}
