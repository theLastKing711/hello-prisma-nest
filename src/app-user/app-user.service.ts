import { AppUser } from './entities/app-user.entity';
import { PrismaService } from './../prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppUserService {
  saltOrRounds = 10;

  constructor(private prisma: PrismaService) {}
  async create(data: Omit<Prisma.AppUserCreateInput, 'role'>) {
    const hash = await bcrypt.hash(data.password, this.saltOrRounds);

    return this.prisma.appUser.create({
      data: {
        ...data,
        password: hash,
        role: 'Admin',
      },
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
    const userModel = await this.prisma.appUser.findUnique({
      where: appUserWhereUniqueInput,
    });

    if (!userModel) {
      return null;
    }

    return userModel;
  }

  async findOneByUserName(userName: string): Promise<AppUser | null> {
    const userModel = await this.prisma.appUser.findFirst({
      where: {
        userName,
      },
    });

    if (!userModel) {
      return null;
    }

    return userModel;
  }

  async update(params: {
    where: Prisma.AppUserWhereUniqueInput;
    data: Prisma.AppUserUpdateInput;
  }): Promise<AppUser> {
    const { where, data } = params;

    const { password: newPassword, ...dataWithoutPassword } = data;

    return this.prisma.appUser.update({
      data: {
        ...dataWithoutPassword,
        ...(newPassword && {
          password: newPassword,
        }),
      },
      where,
    });
  }

  async remove(where: Prisma.AppUserWhereUniqueInput): Promise<AppUser> {
    return this.prisma.appUser.delete({
      where,
    });
  }

  async isUpdatedUserNameDuplicated(
    sentUserId: number,
    sentUserName: string,
  ): Promise<boolean> {
    const isUpdatedUsernameDuplicated = await this.findOneByUserName(
      sentUserName,
    );

    if (!isUpdatedUsernameDuplicated) {
      return false;
    }

    if (
      isUpdatedUsernameDuplicated.userName === sentUserName &&
      sentUserId !== isUpdatedUsernameDuplicated.id
    ) {
      return true;
    }

    return false;
  }

  async isCreatedUserNameDuplicated(sentUserName: string): Promise<boolean> {
    const isCreatedUsernameDuplicated = await this.findOneByUserName(
      sentUserName,
    );

    if (!isCreatedUsernameDuplicated) {
      return false;
    }

    return true;
  }

  async getTotalCount() {
    return this.prisma.appUser.count();
  }
}
