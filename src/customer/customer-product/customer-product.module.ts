import { Module } from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import { CustomerProductController } from './customer-product.controller';

@Module({
  controllers: [CustomerProductController],
  providers: [CustomerProductService]
})
export class CustomerProductModule {}
