import { AppUser } from './entities/app-user.entity';
import { PrismaService } from './../prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppUserService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.AppUserCreateInput) {
    return this.prisma.appUser.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AppUserWhereUniqueInput;
    where?: Prisma.AppUserWhereInput;
    orderBy?: Prisma.AppUserOrderByWithRelationInput;
  }): Promise<AppUser[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.appUser.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    appUserWhereUniqueInput: Prisma.AppUserWhereUniqueInput,
  ): Promise<AppUser | null> {
    return this.prisma.appUser.findUnique({
      where: appUserWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.AppUserWhereUniqueInput;
    data: Prisma.AppUserUpdateInput;
  }): Promise<AppUser> {
    const { where, data } = params;
    return this.prisma.appUser.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.AppUserWhereUniqueInput): Promise<AppUser> {
    return this.prisma.appUser.delete({
      where,
    });
  }
}
