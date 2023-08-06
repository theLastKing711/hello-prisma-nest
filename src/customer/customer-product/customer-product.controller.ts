import { CustomerCategoryService } from './../customer-category/customer-category.service';
import { Controller, Get, Query } from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import { transformCustomerProductToNonDecimalResponse } from './customerProduct.utilites';
import { queryParamsCustomerProductsList } from './dto/query-params-customer-products-list.dto';
import { Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime';

@Controller('customer-product')
export class CustomerProductController {
  constructor(
    private readonly customerProductService: CustomerProductService,
    private readonly customerCategoryService: CustomerCategoryService,
  ) {}

  @Get()
  async findAll(@Query() queryParams?: queryParamsCustomerProductsList) {
    console.log('query params', queryParams);

    const categoryFilter: number | Prisma.IntFilter | undefined =
      queryParams.categoryIds && {
        in: queryParams.categoryIds,
      };

    const priceFilter:
      | string
      | number
      | Prisma.DecimalFilter
      | Prisma.Decimal
      | DecimalJsLike
      | undefined = queryParams.prices && {
      gte: queryParams.prices[0],
      lte: queryParams.prices[1],
    };

    const reviewsFilter: Prisma.ReviewListRelationFilter | undefined =
      queryParams.rating && {
        every: {
          rating: {
            gte: queryParams.rating,
          },
        },
      };

    const nameFilter: string | Prisma.StringFilter | undefined =
      queryParams.search && {
        startsWith: queryParams.search,
      };

    const productModels = await this.customerProductService.findAll({
      take: queryParams.perPage,
      where: {
        categoryId: categoryFilter,
        price: priceFilter,
        reviews: reviewsFilter,
        name: nameFilter,
      },
    });

    const productDtos = productModels.map(
      transformCustomerProductToNonDecimalResponse,
    );

    const totalProductsCount = this.customerProductService.getTotalCount();

    return {
      data: productDtos,
      total: totalProductsCount,
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
