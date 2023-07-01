import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Category } from './entities/category.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  saltOrRounds = 10;

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
  }): Promise<Category[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category | null> {
    const categoryModel = await this.prisma.category.findUnique({
      where: categoryWhereUniqueInput,
    });

    if (!categoryModel) {
      return null;
    }

    return categoryModel;
  }

  async findOneByName(name: string): Promise<Category | null> {
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
  }): Promise<Category> {
    const { where, data } = params;

    return this.prisma.category.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.delete({
      where,
    });
  }

  async isCategoryNameDuplicated(
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
}
