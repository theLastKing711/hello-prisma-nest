import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ResponseDiscountDto } from './dto/response-discount-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DiscountCreateInput) {
    return this.prisma.discount.create({
      data,
      include: {
        product: {
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
    cursor?: Prisma.DiscountWhereUniqueInput;
    where?: Prisma.DiscountWhereInput;
    orderBy?: Prisma.DiscountOrderByWithRelationInput;
  }): Promise<ResponseDiscountDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const discountDtos = await this.prisma.discount.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        product: {
          select: {
            name: true,
          },
          include: {
            category: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    console.log('discounts dto', discountDtos);

    return discountDtos;
  }

  async findOne(
    discountWhereUniqueInput: Prisma.DiscountWhereUniqueInput,
  ): Promise<ResponseDiscountDto | null> {
    const discountModel = await this.prisma.discount.findUnique({
      where: discountWhereUniqueInput,
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!discountModel) {
      return null;
    }

    return discountModel;
  }

  async update(params: {
    where: Prisma.DiscountWhereUniqueInput;
    data: Prisma.DiscountUpdateInput;
  }): Promise<ResponseDiscountDto> {
    const { where, data } = params;

    return this.prisma.discount.update({
      data,
      where,
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(
    where: Prisma.DiscountWhereUniqueInput,
  ): Promise<ResponseDiscountDto> {
    return this.prisma.discount.delete({
      where,
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getTotalCount() {
    return this.prisma.discount.count();
  }
}
