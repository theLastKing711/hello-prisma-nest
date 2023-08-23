import { CurrentUserInterceptor } from 'src/auth/interceptor/CurrentUserInterceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CustomerProductFavouriteService } from './customer-product-favourite.service';
import { AppUser } from '@prisma/client';
import { transformCustomerProductFavourites } from './customerProductFavourites.utilites';

@Controller('product-favourite')
export class CustomerProductFavouriteController {
  constructor(
    private readonly customerProductFavouriteService: CustomerProductFavouriteService,
  ) {}

  @Post()
  @UseInterceptors(CurrentUserInterceptor)
  async toggleFavourite(
    @Req() request: Request & { currentUser: AppUser | null },
    @Body() product: { productId: number },
  ) {
    const userId = request.currentUser.id;

    console.log('userId', userId);

    console.log('productId', product.productId);

    const favouritedProduct =
      await this.customerProductFavouriteService.toggleFavourite({
        appUserId: userId,
        productId: product.productId,
      });
    return favouritedProduct;
  }

  @Get()
  @UseInterceptors(CurrentUserInterceptor)
  async getUserWishList(
    @Req() request: Request & { currentUser: AppUser | null },
  ) {
    const userId = request.currentUser.id;

    console.log('userId', userId);

    const userWishList =
      await this.customerProductFavouriteService.getUserWishList({}, userId);

    const userWishListResponse = await userWishList.map(
      transformCustomerProductFavourites,
    );

    return userWishListResponse;
  }
}
