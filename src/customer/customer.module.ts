import { Module } from '@nestjs/common';
// import { CustomerCategoryModule } from './customer-category/customer-category.module';
// import { CustomerProductModule } from './customer-product/customer-product.module';
import { HomeModule } from './home/home.module';
import { CustomerProductModule } from './customer-product/customer-product.module';
import { CustomerProductFavouriteModule } from './customer-product-favourite/customer-product-favourite.module';

@Module({
  imports: [
    // CustomerCategoryModule,
    CustomerProductModule,
    HomeModule,
    CustomerProductFavouriteModule,
  ],
  exports: [CustomerProductModule],
})
export class CustomerModule {}
