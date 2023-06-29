import { Module } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { AppUserController } from './app-user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AppUserController],
  providers: [AppUserService, PrismaService, AuthModule, JwtService],
})
export class AppUserModule {}
