import { AppUser } from './entities/app-user.entity';
import { PrismaService } from './../prisma.service';
import { Prisma } from '@prisma/client';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppUserService {
  saltOrRounds = 10;

  constructor(private prisma: PrismaService) {}
  async create(data: Exclude<Prisma.AppUserCreateInput, 'role'>) {
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
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    return userModel;
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
