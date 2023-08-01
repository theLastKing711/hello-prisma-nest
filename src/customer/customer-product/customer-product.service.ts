import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ResponseProductDto } from 'src/product/dto/response-product.dto';
import {
  ProductListWithCategoryIdDto,
  ProductListDto,
} from 'src/product/entities/product-list.dto';
import { CustomerProduct } from './entities/customer-product.entity';

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

  async findAll(params: {
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
        discounts: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });
  }

  async findOne(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<CustomerProduct | null> {
    const productModel = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
      select: {
        id: true,
        name: true,
        price: true,
        isBestSeller: true,
        discounts: {
          select: {
            id: true,
            value: true,
          },
        },
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

  async remove(
    where: Prisma.ProductWhereUniqueInput,
  ): Promise<ResponseProductDto> {
    return this.prisma.product.delete({
      where,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findList(): Promise<ProductListDto[]> {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getTotalCount(): Promise<number> {
    return this.prisma.product.count();
  }
}
