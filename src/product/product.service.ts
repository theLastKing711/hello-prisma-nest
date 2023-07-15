import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import {
  ProductListDto,
  ProductListWithCategoryIdDto,
} from './entities/product-list.dto';
import { PrismaService } from 'src/prisma.service';
import { ResponseProductDto } from './dto/response-product.dto';

@Injectable()
export class ProductService {
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
  }): Promise<ResponseProductDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<ResponseProductDto | null> {
    const productModel = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!productModel) {
      return null;
    }

    return productModel;
  }

  async findOneByName(name: string): Promise<ResponseProductDto | null> {
    const productModel = await this.prisma.product.findFirst({
      where: {
        name,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
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
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
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

  async getTotalCount(): Promise<number> {
    return this.prisma.product.count();
  }
}
