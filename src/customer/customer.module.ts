import { Module } from '@nestjs/common';
// import { CustomerCategoryModule } from './customer-category/customer-category.module';
// import { CustomerProductModule } from './customer-product/customer-product.module';
import { CustomerAppUserModule } from './customer-app-user/customer-app-user.module';
import { HomeModule } from './home/home.module';
import { CustomerProductModule } from './customer-product/customer-product.module';

@Module({
  imports: [
    // CustomerCategoryModule,
    CustomerAppUserModule,
    CustomerProductModule,
    HomeModule,
  ],
  exports: [CustomerProductModule],
})
export class CustomerModule {}
