import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { PrismaService } from 'src/prisma.service';
import { AppUserService } from 'src/app-user/app-user.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService, AppUserService, PrismaService],
})
export class HomeModule {}
