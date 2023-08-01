import { Injectable } from '@nestjs/common';
import { CreateCustomerAppUserDto } from './dto/create-customer-app-user.dto';
import { UpdateCustomerAppUserDto } from './dto/update-customer-app-user.dto';

@Injectable()
export class CustomerAppUserService {
  create(createCustomerAppUserDto: CreateCustomerAppUserDto) {
    return 'This action adds a new customerAppUser';
  }

  findAll() {
    return `This action returns all customerAppUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerAppUser`;
  }

  update(id: number, updateCustomerAppUserDto: UpdateCustomerAppUserDto) {
    return `This action updates a #${id} customerAppUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerAppUser`;
  }
}
