import { Module } from '@nestjs/common';
// import { CustomerCategoryModule } from './customer-category/customer-category.module';
// import { CustomerProductModule } from './customer-product/customer-product.module';
import { HomeModule } from './home/home.module';
import { CustomerProductModule } from './customer-product/customer-product.module';
import { CustomerProductFavouriteModule } from './customer-product-favourite/customer-product-favourite.module';
import { CustomerUserModule } from './customer-user/customer-user.module';

@Module({
  imports: [
    // CustomerCategoryModule,
    CustomerProductModule,
    HomeModule,
    CustomerProductFavouriteModule,
    CustomerUserModule,
  ],
  exports: [CustomerProductModule, CustomerProductFavouriteModule],
})
export class CustomerModule {}
