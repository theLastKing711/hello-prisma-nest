import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAppUserDto } from 'src/auth/dto/sign-in-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { transformAppUserToResponse } from 'src/app-user/app-user.utilities';
import { AppUserService } from 'src/app-user/app-user.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { SignUpAppUserDto } from './dto/sign-up-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private appUserService: AppUserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInAppUserDto) {
    return this.authService.signIn(signInDto);
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
