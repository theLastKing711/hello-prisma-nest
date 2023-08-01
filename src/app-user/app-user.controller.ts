import { DateManipluationService } from './../shared/services/date-manipluation/date-manipluation.service';
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
  Query,
} from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Prisma, Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { transformAppUserToResponse } from './app-user.utilities';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { SortAppUserDto } from './dto/sort-app-user.dto';

@Controller('app-user')
// @UseGuards(AuthGuard)
@ApiTags('AppUser')
export class AppUserController {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dateManipluationService: DateManipluationService,
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
    const userModel = await this.appUserService.findOneByUserName(
      createAppUserDto.userName,
    );

    if (userModel) {
      throw new HttpException(
        'User username already exist',
        HttpStatus.CONFLICT,
      );
    }

    const cloudinaryFile = await this.cloudinaryService
      .uploadImage(file)
      .catch((error) => {
        throw new HttpException(
          'Failed to upload image',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      });

    const createdUserModel = await this.appUserService.create({
      imagePath: cloudinaryFile.url,
      userName: createAppUserDto.userName,
      password: createAppUserDto.password,
      // role: createAppUserDto.role || Role.Admin,
      cloudinary_public_id: cloudinaryFile.public_id,
    });

    const responseUserDto = transformAppUserToResponse(createdUserModel);

    return responseUserDto;
  }

  @Get()
  // @Roles(Role.Admin)
  async findAll(@Query() queryParams: SortAppUserDto) {
    // console.log('query params', queryParams);

    const [sortKey, sortValue] = queryParams.sort[0].split(',');

    // console.log('queryParams.filter', queryParams.filter);

    const filterRecord: Record<string, string> | undefined =
      queryParams.filter?.reduce((prev, curr) => {
        const [filterkey, , filterValue] = curr.split('||');
        prev[filterkey] = filterValue;

        return prev;
      }, {});

    const roleFilter = !filterRecord?.role
      ? undefined
      : filterRecord.role === 'admin'
      ? Role.Admin
      : Role.User;

    const userNameFilter = filterRecord?.full_name_search ?? undefined;

    const wherePrismaFilter: Prisma.AppUserWhereInput | undefined =
      queryParams.filter
        ? {
            userName: {
              startsWith: userNameFilter,
            },
            role: roleFilter,
            ...(filterRecord.has_purchased &&
              filterRecord.has_purchased == 'this month' && {
                invoices: {
                  some: {
                    createdAt: {
                      gt: this.dateManipluationService.getLastMonthDate(),
                    },
                  },
                },
              }),
            ...(filterRecord.has_purchased &&
              filterRecord.has_purchased == 'this year' && {
                invoices: {
                  some: {
                    createdAt: {
                      gt: this.dateManipluationService.getLastYearDate(),
                    },
                  },
                },
              }),
          }
        : undefined;

    const userModels = await this.appUserService.findAll({
      where: wherePrismaFilter,
      skip: +queryParams.offset,
      take: +queryParams.limit,
      orderBy: {
        ...(sortKey === 'id' && {
          id: sortValue === 'ASC' ? 'asc' : 'desc',
        }),
        ...(sortKey === 'userName' && {
          userName: sortValue === 'ASC' ? 'asc' : 'desc',
        }),
        ...(sortKey === 'createdAt' && {
          createdAt: sortValue === 'ASC' ? 'asc' : 'desc',
        }),
      },
    });

    const listCount = await this.appUserService.getTotalCount();

    const responseAppUserDtos = userModels.map((user) =>
      transformAppUserToResponse(user),
    );

    return { data: responseAppUserDtos, total: listCount };
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
