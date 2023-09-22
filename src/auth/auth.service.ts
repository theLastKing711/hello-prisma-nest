import { SignInAppUserDto } from 'src/auth/dto/sign-in-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppUserService } from 'src/app-user/app-user.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class AuthService {
  constructor(
    private appUserService: AppUserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  private saltOrRounds = 10;

  async getAccessToken(userId: number) {
    const signedUser = await this.appUserService.findOne({
      id: userId,
    });

    if (!signedUser) {
      throw new UnauthorizedException();
    }

    return this.generateAccessToken(signedUser.id, signedUser.userName);
  }

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

    const { accessToken, refreshToken } = this.generateAccessToken(
      appUserModel.id,
      appUserModel.userName,
    );

    const updatedUser = await this.appUserService.updateRefreshToken(
      appUserModel.id,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    return this.appUserService.updateRefreshToken(userId, null);
  }

  private generateAccessToken(userId: number, username: string) {
    const payload = { sub: userId, username: username };
    console.log('new user', username);

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '1min',
        secret: jwtConstants.secret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '30s',
        secret: jwtConstants.secret,
      }),
    };
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
