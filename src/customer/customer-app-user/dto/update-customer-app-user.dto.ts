import { PartialType } from '@nestjs/swagger';
import { CreateCustomerAppUserDto } from './create-customer-app-user.dto';

export class UpdateCustomerAppUserDto extends PartialType(CreateCustomerAppUserDto) {}
