import { CustomerCategoryService } from './../customer-category/customer-category.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import {
  transformCustomerProductDetailsToNonDecimalResponse,
  transformCustomerProductToNonDecimalResponse,
} from './customerProduct.utilites';
import { queryParamsCustomerProductsList } from './dto/query-params-customer-products-list.dto';
import { AppUser, Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime';
import { CurrentUserInterceptor } from 'src/auth/interceptor/CurrentUserInterceptor';

@Controller('customer-product')
export class CustomerProductController {
  constructor(
    private readonly customerProductService: CustomerProductService,
    private readonly customerCategoryService: CustomerCategoryService,
  ) {}

  private parsePriceFilterArr(priceAsString: string) {
    const [first, second] = priceAsString
      .replaceAll('$', '')
      .trim()
      .split('-')
      .map((x) => +x);

    return [first, second];
  }

  private parsePriceFilter(priceAsString: string) {
    const price = priceAsString.replace('$', '').replace('+', '').trim();

    return price;
  }

  @Get()
  @UseInterceptors(CurrentUserInterceptor)
  async findAll(
    @Req() request: Request & { currentUser: AppUser | null },
    @Query() queryParams?: queryParamsCustomerProductsList,
  ) {
    const userId = request.currentUser ? request.currentUser.id : undefined;
    const sortFilter: Prisma.ProductOrderByWithRelationInput | undefined = {
      ...(queryParams.sort === 'price' && { price: 'desc' }),
    };

    const categoryFilter: number | Prisma.IntFilter | undefined =
      queryParams.categoryIds &&
      (typeof queryParams.categoryIds === 'string'
        ? {
            equals: +queryParams.categoryIds,
          }
        : {
            in: queryParams.categoryIds.map((x) => +x),
          });

    const priceAsNumber = queryParams.prices
      ? queryParams.prices.includes('$')
        ? this.parsePriceFilterArr(queryParams.prices)
        : this.parsePriceFilter(queryParams.prices)
      : undefined;

    const priceFilter:
      | string
      | number
      | Prisma.DecimalFilter
      | Prisma.Decimal
      | DecimalJsLike
      | undefined = queryParams.prices && {
      gte: typeof priceAsNumber === 'string' ? priceAsNumber : priceAsNumber[0],
      lte: typeof priceAsNumber === 'string' ? 10000 : priceAsNumber[1],
    };

    const nameFilter: string | Prisma.StringFilter | undefined =
      queryParams.search && {
        startsWith: queryParams.search,
      };

    const paginationCursor: Prisma.ProductWhereUniqueInput | undefined =
      queryParams && queryParams.id
        ? {
            id: +queryParams.id,
          }
        : undefined;

    const perPage = +queryParams.perPage || 3;
    const shouldSkipOne = queryParams && queryParams.id ? 1 : 0;

    const productModels = await this.customerProductService.findAll(
      {
        take: perPage,
        skip: shouldSkipOne,
        orderBy: sortFilter,
        where: {
          categoryId: categoryFilter,
          price: priceFilter,
          name: nameFilter,
        },
        cursor: paginationCursor,
        // cursor: {
        //   id: 7,
        // },
      },
      userId,
    );

    let productDtos = [];

    productDtos = productModels.map(
      transformCustomerProductToNonDecimalResponse,
    );

    console.log('productDto', productDtos);

    if (queryParams.sort) {
      productDtos.sort((x) => x.averageRating);
    }

    if (queryParams.rating) {
      productDtos = productDtos.filter(
        (x) => x.averageRating >= +queryParams.rating,
      );
    }

    const totalProductsCount = await this.customerProductService.getTotalCount({
      orderBy: sortFilter,
      where: {
        categoryId: categoryFilter,
        price: priceFilter,
        name: nameFilter,
      },
    });

    const totalProductsCountPlusOne =
      await this.customerProductService.getTotalCount({
        take: perPage + 1,
        orderBy: sortFilter,
        where: {
          categoryId: categoryFilter,
          price: priceFilter,
          name: nameFilter,
        },
        cursor: paginationCursor,
        skip: shouldSkipOne,
        // cursor: {
        //   id: 7,
        // },
      });

    const hasNextPage = totalProductsCountPlusOne > productDtos.length;

    console.log('has next page', hasNextPage);

    return {
      data: productDtos,
      total: totalProductsCount,
      hasNextPage,
    };
  }

  @Get('filters')
  async getProductRatingFilterList() {
    const categroeisFilterListDto =
      await this.customerCategoryService.findList();

    const ratingFilterListDto =
      await this.customerProductService.getRatingFilterList();

    return {
      categories: categroeisFilterListDto,
      ratings: ratingFilterListDto,
    };
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    const productModel = await this.customerProductService.findOne(+id);

    if (!productModel) {
      throw new HttpException('Product was not found', HttpStatus.NOT_FOUND);
    }

    const productDto =
      transformCustomerProductDetailsToNonDecimalResponse(productModel);

    return productDto;
  }

  @Get('categories-filter')
  async getCategoriesFilterList() {
    const categoriesListDto = await this.customerCategoryService.findList();

    return categoriesListDto;
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const productModel = await this.customerProductService.findOne({
  //     id: +id,
  //   });

  //   const productDto =
  //     transformCustomerProductToNonDecimalResponse(productModel);

  //   return productDto;
  // }
}
