import { Module } from '@nestjs/common';
import { CustomerUserController } from './customer-user.controller';
// import { CustomerUserService } from './customer-user.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { AppUserService } from 'src/app-user/app-user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CustomerUserController],
  providers: [
    // CustomerUserService,
    AppUserService,
    CloudinaryService,
    PrismaService,
  ],
})
export class CustomerUserModule {}
