import { Module } from '@nestjs/common';
import { CustomerProductFavouriteController } from './customer-product-favourite.controller';
import { CustomerProductFavouriteService } from './customer-product-favourite.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CustomerProductFavouriteController],
  providers: [CustomerProductFavouriteService, PrismaService],
})
export class CustomerProductFavouriteModule {}
