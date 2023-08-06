import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FeaturedProductListDto } from './dto/featured-product-list.dto';
import { LatestProductListDto } from './dto/latest-products-list.dto';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async findFeaturedProducts(): Promise<FeaturedProductListDto[]> {
    return this.prisma.product
      .findMany({
        select: {
          id: true,
          name: true,
          price: true,
          imagePath: true,
        },
      })
      .then((res) => {
        const x: FeaturedProductListDto[] = res.map<FeaturedProductListDto>(
          (item) => ({
            id: item.id,
            imagePath: item.imagePath,
            name: item.name,
            price: +item.price.toFixed(2),
          }),
        );
        return x;
      });
  }

  async findLatestProducts(): Promise<LatestProductListDto[]> {
    return this.prisma.product
      .findMany({
        select: {
          id: true,
          name: true,
          price: true,
          imagePath: true,
          discounts: {
            orderBy: {
              startDate: 'desc',
            },
            select: {
              id: true,
              value: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .then((res) => {
        const x: LatestProductListDto[] = res.map<LatestProductListDto>(
          (item) => ({
            id: item.id,
            imagePath: item.imagePath,
            name: item.name,
            price: +item.price.toFixed(2),
            discount: item.discounts?.length > 0 ? item.discounts[0] : null,
          }),
        );
        return x;
      });
  }

  async findLatestBestSellerProducts(): Promise<LatestProductListDto[]> {
    return this.prisma.product
      .findMany({
        select: {
          id: true,
          name: true,
          price: true,
          imagePath: true,
          discounts: {
            orderBy: {
              startDate: 'desc',
            },
            select: {
              id: true,
              value: true,
            },
          },
        },
        orderBy: {
          price: 'desc',
        },
      })
      .then((res) => {
        const x: LatestProductListDto[] = res.map<LatestProductListDto>(
          (item) => ({
            id: item.id,
            imagePath: item.imagePath,
            name: item.name,
            price: +item.price.toFixed(2),
            discount: item.discounts?.length > 0 ? item.discounts[0] : null,
          }),
        );
        return x;
      });
  }

  async findLatestFeaturedProducts(): Promise<LatestProductListDto[]> {
    return this.prisma.product
      .findMany({
        where: {
          isFeatured: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          imagePath: true,
          discounts: {
            orderBy: {
              startDate: 'desc',
            },
            select: {
              id: true,
              value: true,
            },
          },
        },
        orderBy: {
          price: 'desc',
        },
      })
      .then((res) => {
        const x: LatestProductListDto[] = res.map<LatestProductListDto>(
          (item) => ({
            id: item.id,
            imagePath: item.imagePath,
            name: item.name,
            price: +item.price.toFixed(2),
            discount: item.discounts?.length > 0 ? item.discounts[0] : null,
          }),
        );
        return x;
      });
  }
}
