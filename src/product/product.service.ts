import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { ProductListDto } from './entities/product-list.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  saltOrRounds = 10;

  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<Product[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    const productModel = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });

    if (!productModel) {
      return null;
    }

    return productModel;
  }

  async findOneByName(name: string): Promise<Product | null> {
    const productModel = await this.prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (!productModel) {
      return null;
    }

    return productModel;
  }

  async update(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductUpdateInput;
  }): Promise<Product> {
    const { where, data } = params;

    return this.prisma.product.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    return this.prisma.product.delete({
      where,
    });
  }

  async isProductNameDuplicated(
    sentUserId: number,
    setName: string,
  ): Promise<boolean> {
    const productSearchedByName = await this.findOneByName(setName);

    if (!productSearchedByName) {
      return false;
    }

    if (
      productSearchedByName.name === setName &&
      sentUserId !== productSearchedByName.id
    ) {
      return true;
    }

    return false;
  }

  async findList(): Promise<ProductListDto[]> {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
