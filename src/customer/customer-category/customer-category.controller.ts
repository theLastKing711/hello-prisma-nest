import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerCategoryService } from './customer-category.service';
import { CreateCustomerCategoryDto } from './dto/create-customer-category.dto';
import { UpdateCustomerCategoryDto } from './dto/update-customer-category.dto';

@Controller('customer-category')
export class CustomerCategoryController {
  constructor(private readonly customerCategoryService: CustomerCategoryService) {}

  @Post()
  create(@Body() createCustomerCategoryDto: CreateCustomerCategoryDto) {
    return this.customerCategoryService.create(createCustomerCategoryDto);
  }

  @Get()
  findAll() {
    return this.customerCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerCategoryDto: UpdateCustomerCategoryDto) {
    return this.customerCategoryService.update(+id, updateCustomerCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerCategoryService.remove(+id);
  }
}
