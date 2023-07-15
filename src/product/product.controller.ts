import { ApiTags } from '@nestjs/swagger';
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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { transformProductToNonDecimalResponse } from './product.utilites';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { SortProductDto } from './dto/sort-product.dto';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private cloudinaryService: CloudinaryService,
  ) {}

  convertStringToBoolean(value: string) {
    if (value === 'true') return true;

    return false;
  }

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
    @Body() createProductDto: CreateProductDto,
  ) {
    const productModel = await this.productService.findOneByName(
      createProductDto.name,
    );

    if (productModel) {
      throw new HttpException(
        'Product name already Exist',
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

    const createdProductModel = await this.productService.create({
      imagePath: cloudinaryFile.url,
      name: createProductDto.name,
      price: createProductDto.price,
      isBestSeller: this.convertStringToBoolean(createProductDto.isBestSeller),
      category: {
        connect: {
          id: parseInt(createProductDto.categoryId),
        },
      },
      cloudinary_public_id: cloudinaryFile.public_id,
    });

    const responseProductDto = transformProductToNonDecimalResponse({
      ...createdProductModel,
      category: createProductDto,
    });

    return responseProductDto;
  }

  @Get()
  async findAll(
    params:
      | {
          skip?: number;
          take?: number;
          cursor?: Prisma.ProductWhereUniqueInput;
          where?: Prisma.ProductWhereInput;
          orderBy?: Prisma.ProductOrderByWithRelationInput;
        }
      | undefined,
    @Query() queryParams?: SortProductDto,
  ) {
    const filterRecord: Record<string, string> | undefined =
      queryParams.filter?.reduce((prev, curr) => {
        const [filterkey, , filterValue] = curr.split('||');
        prev[filterkey] = filterValue;

        return prev;
      }, {});

    const nameFilter = filterRecord?.name ?? undefined;

    const productModels = await this.productService.findAll({
      where: {
        name: {
          startsWith: nameFilter,
        },
      },
      skip: +queryParams.offset,
      take: +queryParams.limit,
    });

    const listCount = await this.productService.getTotalCount();

    const responseProductDtos = productModels.map((product) =>
      transformProductToNonDecimalResponse({
        ...product,
      }),
    );

    return {
      data: responseProductDtos,
      total: listCount,
    };
  }

  @Get('list')
  async findList() {
    return this.productService.findList();
  }

  @Get('list-with-category')
  async findListWithCategory() {
    console.log('hello world');
    return this.productService.findListWithCategoryId();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const responseProductDto = await this.productService.findOne({ id: +id });

    if (!responseProductDto) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    // const responseProductDto = transformProductToNonDecimalResponse({
    //   ...productModel,
    // });

    return responseProductDto;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
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
    const productModel = await this.productService.findOne({ id: +id });

    if (!productModel) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    const isProductNameDuplicated =
      await this.productService.isProductNameDuplicated(
        +id,
        updateProductDto.name,
      );

    if (isProductNameDuplicated) {
      throw new HttpException(
        'The product with given productname already exist, please change productname',
        HttpStatus.CONFLICT,
      );
    }

    let cloudinaryFile: UploadApiResponse | UploadApiErrorResponse;

    if (file) {
      const deletedImage = await this.cloudinaryService
        .removeImage(productModel.cloudinary_public_id)
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

    const updatedProductModel = await this.productService.update({
      where: {
        id: +id,
      },
      data: {
        imagePath: productModel.imagePath,
        name: updateProductDto.name,
        price: updateProductDto.price,
        isBestSeller: this.convertStringToBoolean(
          updateProductDto.isBestSeller,
        ),
        category: {
          connect: {
            id: parseInt(updateProductDto.categoryId),
          },
        },
        ...(cloudinaryFile && {
          cloudinary_public_id: cloudinaryFile.public_id,
        }),
        ...(cloudinaryFile && {
          imagePath: cloudinaryFile.url,
        }),
      },
    });

    // const responseProductDto =
    //   transformProductToNonDecimalResponse(updatedProductModel);

    return updatedProductModel;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isProductAvailable = this.productService.findOne({ id: +id });

    if (!isProductAvailable) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    const productModel = await this.productService.remove({ id: +id });

    const deletedImage = await this.cloudinaryService
      .removeImage(productModel.cloudinary_public_id)
      .catch((error) => {
        throw new HttpException(
          'failed to upload image',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      });

    const responseProductDto = transformProductToNonDecimalResponse({
      ...productModel,
    });

    return responseProductDto;
  }

  @Get(':id/validate-name-duplication')
  async validateProduct(
    @Param('id') id: string,
    @Body() catgoryDto: Pick<CreateProductDto, 'name'>,
  ) {
    return await this.productService.isProductNameDuplicated(
      +id,
      catgoryDto.name,
    );
  }
}
