import { Controller, Get, Param } from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import { transformCustomerProductToNonDecimalResponse } from './customerProduct.utilites';

@Controller('customer-product')
export class CustomerProductController {
  constructor(
    private readonly customerProductService: CustomerProductService,
  ) {}

  @Get()
  async findAll() {
    const productModels = await this.customerProductService.findAll({});

    const productDtos = productModels.map(
      transformCustomerProductToNonDecimalResponse,
    );

    return productDtos;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const productModel = await this.customerProductService.findOne({
      id: +id,
    });

    const productDto =
      transformCustomerProductToNonDecimalResponse(productModel);

    return productDto;
  }
}
