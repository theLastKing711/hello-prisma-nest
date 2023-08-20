import { Body, Controller, Req } from '@nestjs/common';
import { CustomerProductFavouriteService } from './customer-product-favourite.service';
import { AppUser } from '@prisma/client';

@Controller('customer-product-favourite')
export class CustomerProductFavouriteController {
  constructor(
    private readonly customerProductFavouriteService: CustomerProductFavouriteService,
  ) {}

  async toggleFavourite(
    @Req() request: Request & { currentUser: AppUser | null },
    @Body() productId: number,
  ) {
    const userId = request.currentUser.id;
    const favouritedProduct =
      await this.customerProductFavouriteService.toggleFavourite(
        userId,
        productId,
      );
    return favouritedProduct;
  }
}
