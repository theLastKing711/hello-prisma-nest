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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { transformProductToResponse } from './product.utilites';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';

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

    const responseProductDto = transformProductToResponse({
      ...createdProductModel,
      price: parseFloat(createdProductModel.price.toFixed(2)),
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
  ) {
    const productModels = await this.productService.findAll(params || {});

    const responseProductServiceDtos = productModels.map((product) =>
      transformProductToResponse({
        ...product,
        price: parseFloat(product.price.toFixed(2)),
      }),
    );

    return responseProductServiceDtos;
  }

  @Get('list')
  async findList() {
    return this.productService.findList();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const productModel = await this.productService.findOne({ id: +id });

    if (!productModel) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    const responseProductDto = transformProductToResponse({
      ...productModel,
      price: parseFloat(productModel.price.toFixed(2)),
    });

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

    const responseProductDto = transformProductToResponse({
      ...updatedProductModel,
      price: parseFloat(updatedProductModel.price.toFixed(2)),
    });

    return responseProductDto;
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

    const responseProductDto = transformProductToResponse({
      ...productModel,
      price: parseFloat(productModel.price.toFixed(2)),
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
