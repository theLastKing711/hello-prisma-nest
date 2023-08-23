import { Module } from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import { CustomerProductController } from './customer-product.controller';
import { PrismaService } from 'src/prisma.service';
import { CustomerCategoryService } from '../customer-category/customer-category.service';
import { AppUserService } from 'src/app-user/app-user.service';

@Module({
  controllers: [CustomerProductController],
  providers: [
    CustomerProductService,
    CustomerCategoryService,
    AppUserService,
    PrismaService,
  ],
})
export class CustomerProductModule {}
