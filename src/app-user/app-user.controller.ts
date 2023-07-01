import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppUserService } from './app-user.service';
import {
  CreateAppUserDto,
  CreateAppUserDtoWithCloudinaryPublicId,
} from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Prisma, Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { transformAppUserToResponse } from './app-user.utilities';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Controller('app-user')
@UseGuards(AuthGuard)
export class AppUserController {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly cloudlinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createAppUserDto: CreateAppUserDto,
  ) {
    const cloudinaryFile = await this.cloudlinaryService
      .uploadImage(file)
      .catch((error) => {
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      });

    const userWithCloudinaryPublicId: CreateAppUserDtoWithCloudinaryPublicId = {
      ...createAppUserDto,
      cloudinary_public_id: cloudinaryFile.public_id,
    };

    const createdUserModel = await this.appUserService.create({
      imagePath: cloudinaryFile.url,
      userName: createAppUserDto.userName,
      password: createAppUserDto.password,
      role: createAppUserDto.role || Role.Admin,
      cloudinary_public_id: userWithCloudinaryPublicId.cloudinary_public_id,
    });

    const responseUserDto = transformAppUserToResponse(createdUserModel);

    return responseUserDto;
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(
    params:
      | {
          skip?: number;
          take?: number;
          cursor?: Prisma.AppUserWhereUniqueInput;
          where?: Prisma.AppUserWhereInput;
          orderBy?: Prisma.AppUserOrderByWithRelationInput;
        }
      | undefined,
  ) {
    const userModels = await this.appUserService.findAll(params || {});

    const responseAppUserDtos = userModels.map((user) =>
      transformAppUserToResponse(user),
    );

    return responseAppUserDtos;
  }

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

    const isUserNameDuplicated = await this.appUserService.isUserNameDuplicated(
      +id,
      updateAppUserDto.userName,
    );

    if (isUserNameDuplicated) {
      throw new HttpException(
        'The user with given username already exist, please change username',
        HttpStatus.CONFLICT,
      );
    }

    let cloudinaryFile: UploadApiResponse | UploadApiErrorResponse;

    if (file) {
      const deletedImage = await this.cloudlinaryService
        .removeImage(userModel.cloudinary_public_id)
        .catch(async (error) => {
          throw new HttpException(
            'Failed to upload image',
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          );
        });
      cloudinaryFile = await this.cloudlinaryService
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
        userName: updateAppUserDto.userName,
        password: updateAppUserDto.password,
        role: updateAppUserDto.role || 'Admin',
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
    const deletedImage = await this.cloudlinaryService
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

  @Get(':id/validate-userName-duplication')
  async validateUserName(
    @Param('id') id: string,
    @Body() userDto: Pick<CreateAppUserDto, 'userName'>,
  ) {
    console.log('testing');
    return await this.appUserService.isUserNameDuplicated(
      +id,
      userDto.userName,
    );
  }
}
