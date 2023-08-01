import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DateManipluationService } from 'src/shared/services/date-manipluation/date-manipluation.service';

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    PrismaService,
    JwtService,
    DateManipluationService,
  ],
})
export class ReviewModule {}
