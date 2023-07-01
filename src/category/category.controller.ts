import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma, Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { transformCategoryToResponse } from './cateogry.utilities';

@Controller('category')
@Roles(Role.Admin)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private cloudinaryService: CloudinaryService,
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
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const categoryModel = await this.categoryService.findOneByName(
      createCategoryDto.name,
    );

    if (categoryModel) {
      throw new HttpException(
        'Category name already Exist',
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

    const createdCategoryModel = await this.categoryService.create({
      imagePath: cloudinaryFile.url,
      name: createCategoryDto.name,
      cloudinary_public_id: cloudinaryFile.public_id,
    });

    const responseUserDto = transformCategoryToResponse(createdCategoryModel);

    return responseUserDto;
  }

  @Get()
  async findAll(
    params:
      | {
          skip?: number;
          take?: number;
          cursor?: Prisma.CategoryWhereUniqueInput;
          where?: Prisma.CategoryWhereInput;
          orderBy?: Prisma.CategoryOrderByWithRelationInput;
        }
      | undefined,
  ) {
    const categoryModels = await this.categoryService.findAll(params || {});

    const responseCategoryServiceDtos = categoryModels.map((user) =>
      transformCategoryToResponse(user),
    );

    return responseCategoryServiceDtos;
  }

  @Get('list')
  async findList() {
    return this.categoryService.findList();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userModel = await this.categoryService.findOne({ id: +id });

    if (!userModel) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    const responseUserDto = transformCategoryToResponse(userModel);

    return responseUserDto;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryServiceDto: UpdateCategoryDto,
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
    const userModel = await this.categoryService.findOne({ id: +id });

    if (!userModel) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    const isCategoryNameDuplicated =
      await this.categoryService.isCategoryNameDuplicated(
        +id,
        updateCategoryServiceDto.name,
      );

    if (isCategoryNameDuplicated) {
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

    const updatedUserModel = await this.categoryService.update({
      where: {
        id: +id,
      },
      data: {
        imagePath: userModel.imagePath,
        name: updateCategoryServiceDto.name,
        ...(cloudinaryFile && {
          cloudinary_public_id: cloudinaryFile.public_id,
        }),
        ...(cloudinaryFile && {
          imagePath: cloudinaryFile.url,
        }),
      },
    });

    const responseUserDto = transformCategoryToResponse(updatedUserModel);

    return responseUserDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isUserAvailable = this.categoryService.findOne({ id: +id });

    if (!isUserAvailable) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    const userModel = await this.categoryService.remove({ id: +id });
    const deletedImage = await this.cloudinaryService
      .removeImage(userModel.cloudinary_public_id)
      .catch((error) => {
        throw new HttpException(
          'failed to upload image',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      });

    const responseUserDto = transformCategoryToResponse(userModel);

    return responseUserDto;
  }

  @Get(':id/validate-name-duplication')
  async validateCategory(
    @Param('id') id: string,
    @Body() catgoryDto: Pick<CreateCategoryDto, 'name'>,
  ) {
    return await this.categoryService.isCategoryNameDuplicated(
      +id,
      catgoryDto.name,
    );
  }
}
