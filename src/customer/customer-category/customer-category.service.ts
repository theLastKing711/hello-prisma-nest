import { Prisma } from '@prisma/client';
import { CustomerCategory } from './entities/customer-category.entity';
import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerCategoryService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<CustomerCategory[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        imagePath: true,
      },
    });
  }

  async findOne(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<CustomerCategory | null> {
    const categoryModel = await this.prisma.category.findUnique({
      where: categoryWhereUniqueInput,
      select: {
        id: true,
        name: true,
        imagePath: true,
      },
    });

    if (!categoryModel) {
      return null;
    }

    return categoryModel;
  }

  async findOneByName(name: string): Promise<CustomerCategory | null> {
    const categoryModel = await this.prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (!categoryModel) {
      return null;
    }

    return categoryModel;
  }

  async update(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<CustomerCategory> {
    const { where, data } = params;

    return this.prisma.category.update({
      data,
      where,
    });
  }

  async remove(
    where: Prisma.CategoryWhereUniqueInput,
  ): Promise<CustomerCategory> {
    return this.prisma.category.delete({
      where,
    });
  }

  async isCustomerCategoryNameDuplicated(
    sentUserId: number,
    setName: string,
  ): Promise<boolean> {
    const categorySearchedByName = await this.findOneByName(setName);

    if (!categorySearchedByName) {
      return false;
    }

    if (
      categorySearchedByName.name === setName &&
      sentUserId !== categorySearchedByName.id
    ) {
      return true;
    }

    return false;
  }

  async findList(): Promise<CustomerCategory[]> {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        imagePath: true,
      },
    });
  }

  async isUpdatedCustomerCategoryDuplicated(
    sentUserId: number,
    sentName: string,
  ): Promise<boolean> {
    const isUpdatedUsernameDuplicated = await this.findOneByName(sentName);

    if (!isUpdatedUsernameDuplicated) {
      return false;
    }

    if (
      isUpdatedUsernameDuplicated.name === sentName &&
      sentUserId !== isUpdatedUsernameDuplicated.id
    ) {
      return true;
    }

    return false;
  }

  async isCreatedCategroyDuplicated(sentName: string): Promise<boolean> {
    const isCreatedUsernameDuplicated = await this.findOneByName(sentName);

    if (!isCreatedUsernameDuplicated) {
      return false;
    }

    return true;
  }

  async getTotalCount(): Promise<number> {
    return this.prisma.category.count();
  }
}
