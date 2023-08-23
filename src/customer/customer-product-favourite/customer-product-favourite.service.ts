import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { WishListModel } from './dto/wishlist-response';

@Injectable()
export class CustomerProductFavouriteService {
  constructor(private prisma: PrismaService) {}

  async toggleFavourite(data: { appUserId: number; productId: number }) {
    const isProductAlreadyFavouritedByUser =
      await this.prisma.productFavourite.findFirst({
        where: {
          productId: data.productId,
          appUserId: data.appUserId,
        },
      });

    console.log('product', isProductAlreadyFavouritedByUser);

    if (isProductAlreadyFavouritedByUser) {
      console.log('deleted');

      const deletedProduct = await this.prisma.productFavourite.delete({
        where: {
          id: isProductAlreadyFavouritedByUser.id,
        },
      });
      return deletedProduct;
    } else {
      console.log('added');

      const addedProduct = await this.prisma.productFavourite.create({
        data: {
          productId: data.productId,
          appUserId: data.appUserId,
        },
      });

      return addedProduct;
    }
  }

  async getUserWishList(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ProductWhereUniqueInput;
      where?: Prisma.ProductWhereInput;
      orderBy?: Prisma.ProductOrderByWithRelationInput;
    },
    appUserId: number,
  ): Promise<WishListModel[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.productFavourite.findMany({
      skip,
      take,
      cursor,
      where: {
        appUserId,
      },
      orderBy,
      select: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            isBestSeller: true,
            imagePath: true,
            discounts: {
              select: {
                id: true,
                value: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });
  }
}
