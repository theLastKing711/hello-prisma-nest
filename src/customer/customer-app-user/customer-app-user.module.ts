import { Module } from '@nestjs/common';
import { CustomerAppUserService } from './customer-app-user.service';
import { CustomerAppUserController } from './customer-app-user.controller';

@Module({
  controllers: [CustomerAppUserController],
  providers: [CustomerAppUserService]
})
export class CustomerAppUserModule {}
