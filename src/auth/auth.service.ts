import { SignInAppUserDto } from 'src/app-user/dto/sign-in-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppUserService } from 'src/app-user/app-user.service';

@Injectable()
export class AuthService {
  constructor(
    private appUserService: AppUserService,
    private jwtService: JwtService,
  ) {}

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
}
