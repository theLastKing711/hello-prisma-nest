import { Module } from '@nestjs/common';
import { CustomerProductFavouriteController } from './customer-product-favourite.controller';
import { CustomerProductFavouriteService } from './customer-product-favourite.service';
import { PrismaService } from 'src/prisma.service';
import { AppUserService } from 'src/app-user/app-user.service';

@Module({
  controllers: [CustomerProductFavouriteController],
  providers: [CustomerProductFavouriteService, AppUserService, PrismaService],
})
export class CustomerProductFavouriteModule {}
