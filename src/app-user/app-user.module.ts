import { Module } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { AppUserController } from './app-user.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AppUserController],
  providers: [AppUserService, PrismaService],
})
export class AppUserModule {}
