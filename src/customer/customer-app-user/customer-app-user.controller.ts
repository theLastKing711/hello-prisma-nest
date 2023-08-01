import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerAppUserService } from './customer-app-user.service';
import { CreateCustomerAppUserDto } from './dto/create-customer-app-user.dto';
import { UpdateCustomerAppUserDto } from './dto/update-customer-app-user.dto';

@Controller('customer-app-user')
export class CustomerAppUserController {
  constructor(private readonly customerAppUserService: CustomerAppUserService) {}

  @Post()
  create(@Body() createCustomerAppUserDto: CreateCustomerAppUserDto) {
    return this.customerAppUserService.create(createCustomerAppUserDto);
  }

  @Get()
  findAll() {
    return this.customerAppUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerAppUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerAppUserDto: UpdateCustomerAppUserDto) {
    return this.customerAppUserService.update(+id, updateCustomerAppUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerAppUserService.remove(+id);
  }
}
