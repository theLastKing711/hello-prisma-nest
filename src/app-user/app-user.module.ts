import { Module } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { AppUserController } from './app-user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AppUserController],
  providers: [AppUserService, PrismaService, JwtService],
})
export class AppUserModule {}
