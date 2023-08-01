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
  Query,
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
import { ApiTags } from '@nestjs/swagger';
import { SortCategoryDto } from './dto/sort-category.dto';

@Controller('category')
@ApiTags('Category')
// @Roles(Role.Admin)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    @Query() queryParams?: SortCategoryDto,
  ) {
    const filterRecord: Record<string, string> | undefined =
      queryParams.filter?.reduce((prev, curr) => {
        const [filterkey, , filterValue] = curr.split('||');
        prev[filterkey] = filterValue;

        return prev;
      }, {});

    const nameFilter = filterRecord?.name ?? undefined;

    const categoryModels = await this.categoryService.findAll({
      where: {
        name: {
          startsWith: nameFilter,
        },
      },
      skip: +queryParams.offset,
      take: +queryParams.limit,
    });

    const listCount = await this.categoryService.getTotalCount();

    const responseCategoryServiceDtos = categoryModels.map((user) =>
      transformCategoryToResponse(user),
    );

    return {
      data: responseCategoryServiceDtos,
      total: listCount,
    };
  }

  @Get('list')
  async findList() {
    const categoriesList = await this.categoryService.findList();

    return categoriesList;
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
}
