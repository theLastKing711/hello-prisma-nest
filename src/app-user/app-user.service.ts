import { AppUser } from './entities/app-user.entity';
import { PrismaService } from './../prisma.service';
import { Prisma } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInAppUserDto } from './dto/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AppUserService {
  saltOrRounds = 10;

  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async create(data: Prisma.AppUserCreateInput) {
    const hash = await bcrypt.hash(data.password, this.saltOrRounds);

    return this.prisma.appUser.create({
      data: {
        ...data,
        password: hash,
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
    // try {
    const userModel = await this.prisma.appUser.findFirst({
      where: appUserWhereUniqueInput,
    });
    Promise.reject(new HttpException('User not found', HttpStatus.FORBIDDEN));
    return userModel;
    // } catch (err) {
    //   throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    // }
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

  async signIn(appUserDto: SignInAppUserDto) {
    const appUserModel = await this.findOne({});

    const user = await this.prisma.appUser.findFirstOrThrow();

    const isMatch = await bcrypt.compare(
      appUserModel.password,
      appUserModel.password,
    );

    if (!isMatch) {
      throw new Error();
    }

    const payload = { sub: appUserModel.id, username: appUserModel.userName };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
