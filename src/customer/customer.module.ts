import { Module } from '@nestjs/common';
import { CustomerCategoryModule } from './customer-category/customer-category.module';
import { CustomerProductModule } from './customer-product/customer-product.module';
import { CustomerAppUserModule } from './customer-app-user/customer-app-user.module';

@Module({
  imports: [
    CustomerCategoryModule,
    CustomerProductModule,
    CustomerAppUserModule,
  ],
  exports: [CustomerCategoryModule],
})
export class CustomerModule {}
