import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CustomerProductFavouriteService {
  constructor(private prisma: PrismaService) {}

  async toggleFavourite(appUserId: number, productId: number) {
    const isProductAlreadyFavouredByUser =
      await this.prisma.productFavourite.findFirst({
        where: {
          productId,
          appUserId,
        },
      });

    if (isProductAlreadyFavouredByUser) {
      const deletedProduct = await this.prisma.productFavourite.delete({
        where: {
          id: (await isProductAlreadyFavouredByUser).id,
        },
      });
      return deletedProduct;
    } else {
      const addedProduct = await this.prisma.productFavourite.create({
        data: {
          appUserId,
          productId,
        },
      });

      return addedProduct;
    }
  }
}
