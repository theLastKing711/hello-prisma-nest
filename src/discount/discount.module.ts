import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DateManipluationService } from 'src/shared/services/date-manipluation/date-manipluation.service';

@Module({
  controllers: [DiscountController],
  providers: [
    DiscountService,
    PrismaService,
    JwtService,
    DateManipluationService,
  ],
})
export class DiscountModule {}
