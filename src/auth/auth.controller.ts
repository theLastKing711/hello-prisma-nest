import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAppUserDto } from 'src/auth/dto/sign-in-user.dto';
import { transformAppUserToResponse } from 'src/app-user/app-user.utilities';
import { AppUserService } from 'src/app-user/app-user.service';
import { SignUpAppUserDto } from './dto/sign-up-user.dto';
import { CurrentUserInterceptor } from './interceptor/CurrentUserInterceptor';
import { AppUser } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private appUserService: AppUserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('getAccessToken')
  @UseInterceptors(CurrentUserInterceptor)
  generateAccessToken(
    @Req() request: Request & { currentUser: AppUser | null },
  ) {
    if (!request.currentUser || !request.currentUser.id) {
      throw new UnauthorizedException();
    }

    return this.authService.getAccessToken(request.currentUser.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInAppUserDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('logout')
  @UseInterceptors(CurrentUserInterceptor)
  logout(@Req() request: Request & { currentUser: AppUser | null }) {
    if (!request.currentUser || !request.currentUser.id) {
      throw new UnauthorizedException();
    }
    return this.authService.logout(request.currentUser.id);
  }

  @Post('sign-up')
  // @UseInterceptors(FileInterceptor('file'))
  async create(
    // @UploadedFile(
    //   new ParseFilePipe({
    //     validators: [
    //       new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    //       new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
    //     ],
    //   }),
    // )
    // file: Express.Multer.File,
    @Body() createAppUserDto: SignUpAppUserDto,
  ) {
    const userModel = await this.appUserService.findOneByUserName(
      createAppUserDto.userName,
    );

    if (userModel) {
      throw new HttpException(
        'User username already exist',
        HttpStatus.CONFLICT,
      );
    }

    // const cloudinaryFile = await this.cloudinaryService
    //   .uploadImage(file)
    //   .catch((error) => {
    //     throw new HttpException(
    //       'Failed to upload image',
    //       HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    //     );
    //   });

    const createdUserModel = await this.authService.create({
      // imagePath: cloudinaryFile.url,
      userName: createAppUserDto.userName,
      password: createAppUserDto.password,
      // cloudinary_public_id: cloudinaryFile.public_id,
    });

    const responseUserDto = transformAppUserToResponse(createdUserModel);

    return responseUserDto;
  }
}
