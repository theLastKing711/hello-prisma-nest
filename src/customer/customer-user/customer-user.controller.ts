import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppUser, Role } from '@prisma/client';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { AppUserService } from 'src/app-user/app-user.service';
import { transformAppUserToResponse } from 'src/app-user/app-user.utilities';
import { CreateAppUserDto } from 'src/app-user/dto/create-app-user.dto';
import { UpdateAppUserDto } from 'src/app-user/dto/update-app-user.dto';
import { CurrentUserInterceptor } from 'src/auth/interceptor/CurrentUserInterceptor';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';

// @UseGuards(AuthGuard)
@Controller('customer-user')
export class CustomerUserController {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userModel = await this.appUserService.findOne({ id: +id });

    if (!userModel) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    const responseUserDto = transformAppUserToResponse(userModel);

    return responseUserDto;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateAppUserDto: UpdateAppUserDto,
  ) {
    const userModel = await this.appUserService.findOne({ id: +id });


    if (!userModel) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    console.log('user model', userModel);

    const isUserNameDuplicated =
      await this.appUserService.isUpdatedUserNameDuplicated(
        +id,
        updateAppUserDto.userName,
      );

    if (isUserNameDuplicated) {
      throw new HttpException(
        'The user with given username already exist, please change username',
        HttpStatus.CONFLICT,
      );
    }

    const updatedUserModel = await this.appUserService.update({
      where: {
        id: +id,
      },
      data: {
        imagePath: userModel.imagePath,
        userName: updateAppUserDto.userName,
        password: updateAppUserDto.password,
        role: Role.User,
      },
    });

    const responseUserDto = transformAppUserToResponse(updatedUserModel);

    return responseUserDto;
  }

  @Patch(':id/updateImage')
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(CurrentUserInterceptor)
  async updateImage(
    @Param('id') id: string,
    @Body() imageObject: { file: File },
    @Req() request: Request & { currentUser: AppUser | null },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userModel = await this.appUserService.findOne({ id: +id });

    if (!userModel) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    const isUserNameDuplicated =
      await this.appUserService.isUpdatedUserNameDuplicated(
        +id,
        userModel.userName,
      );

    if (isUserNameDuplicated) {
      throw new HttpException(
        'The user with given username already exist, please change username',
        HttpStatus.CONFLICT,
      );
    }

    let cloudinaryFile: UploadApiResponse | UploadApiErrorResponse;

    if (file) {
      const deletedImage = await this.cloudinaryService
        .removeImage(userModel.cloudinary_public_id)
        .catch(async (error) => {
          throw new HttpException(
            'Failed to upload image',
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          );
        });
      cloudinaryFile = await this.cloudinaryService
        .uploadImage(file)
        .catch((error) => {
          throw new HttpException(
            'Failed to upload image',
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          );
        });
    }

    const updatedUserModel = await this.appUserService.update({
      where: {
        id: +id,
      },
      data: {
        imagePath: userModel.imagePath,
        ...(cloudinaryFile && {
          cloudinary_public_id: cloudinaryFile.public_id,
        }),
        ...(cloudinaryFile && {
          imagePath: cloudinaryFile.url,
        }),
      },
    });

    const responseUserDto = transformAppUserToResponse(updatedUserModel);

    return responseUserDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isUserAvailable = this.appUserService.findOne({ id: +id });

    if (!isUserAvailable) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    const userModel = await this.appUserService.remove({ id: +id });
    const deletedImage = await this.cloudinaryService
      .removeImage(userModel.cloudinary_public_id)
      .catch((error) => {
        throw new HttpException(
          'failed to upload image',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      });

    const responseUserDto = transformAppUserToResponse(userModel);

    return responseUserDto;
  }

  @Post(':id/validate-userName-duplication')
  async validateUserNameOnUpdate(
    @Param('id') id: string,
    @Body() userDto: Pick<CreateAppUserDto, 'userName'>,
  ) {
    return await this.appUserService.isUpdatedUserNameDuplicated(
      +id,
      userDto.userName,
    );
  }

  @Post('validate-userName-duplication')
  async validateUserNameOnCreate(
    @Body() userDto: Pick<CreateAppUserDto, 'userName'>,
  ) {
    return await this.appUserService.isCreatedUserNameDuplicated(
      userDto.userName,
    );
  }
}
