import { SignInAppUserDto } from 'src/auth/dto/sign-in-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppUserService } from 'src/app-user/app-user.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private appUserService: AppUserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  saltOrRounds = 10;

  async signIn(appUserDto: SignInAppUserDto) {
    const appUserModel = await this.appUserService.findOneByUserName(
      appUserDto.userName,
    );
    const isMatch = await bcrypt.compare(
      appUserDto.password,
      appUserModel.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: appUserModel.id, username: appUserModel.userName };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async create(data: Omit<Prisma.AppUserCreateInput, 'role'>) {
    const hash = await bcrypt.hash(data.password, this.saltOrRounds);

    return this.prisma.appUser.create({
      data: {
        ...data,
        password: hash,
        role: 'User',
      },
    });
  }
}
