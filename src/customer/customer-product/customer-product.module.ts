import { Module } from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import { CustomerProductController } from './customer-product.controller';
import { PrismaService } from 'src/prisma.service';
import { CustomerCategoryService } from '../customer-category/customer-category.service';

@Module({
  controllers: [CustomerProductController],
  providers: [CustomerProductService, CustomerCategoryService, PrismaService],
})
export class CustomerProductModule {}
