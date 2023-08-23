import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductListWithCategoryIdDto } from 'src/product/entities/product-list.dto';
import { CustomerProduct } from './entities/customer-product.entity';
import { productRatingFilterDto } from './dto/productRatingFilter.dto';

@Injectable()
export class CustomerProductService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAll(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ProductWhereUniqueInput;
      where?: Prisma.ProductWhereInput;
      orderBy?: Prisma.ProductOrderByWithRelationInput;
    },
    appUserId?: number,
  ): Promise<CustomerProduct[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
        ProductFavourite: {
          where: {
            appUserId,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }

  async getCategoriesList(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<CustomerProduct[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
        ProductFavourite: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<CustomerProduct | null> {
    const productModel = await this.prisma.product.findUnique({
      select: {
        id: true,
        name: true,
        details: true,
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
        ProductFavourite: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!productModel) {
      return null;
    }

    return productModel;
  }

  async findListWithCategoryId(): Promise<ProductListWithCategoryIdDto[]> {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getRatingFilterList(): Promise<productRatingFilterDto[]> {
    const gteFourStarsStats = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        rating: {
          gte: 4,
        },
      },
    });

    const gteThreeStarsStats = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        rating: {
          gte: 3,
        },
      },
    });

    const gteTwoStarsStats = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        rating: {
          gte: 3,
        },
      },
    });

    const gteOneStarsStats = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        rating: {
          gte: 1,
        },
      },
    });

    const ratingFilterList = [
      {
        starsNumber: 4,
        reviews: gteFourStarsStats._avg.rating
          ? parseFloat(gteFourStarsStats._avg.rating.toFixed(0))
          : 0,
      },
      {
        starsNumber: 3,
        reviews: gteThreeStarsStats._avg.rating
          ? parseFloat(gteThreeStarsStats._avg.rating.toFixed(0))
          : 0,
      },
      {
        starsNumber: 2,
        reviews: gteTwoStarsStats._avg.rating
          ? parseFloat(gteTwoStarsStats._avg.rating.toFixed(0))
          : 0,
      },
      {
        starsNumber: 1,
        reviews: gteOneStarsStats._avg.rating
          ? parseFloat(gteOneStarsStats._avg.rating.toFixed(0))
          : 0,
      },
    ];

    return ratingFilterList;
  }

  async getTotalCount(): Promise<number> {
    return this.prisma.product.count();
  }
}
