import { Module } from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { AppUserController } from './app-user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { DateManipluationService } from 'src/shared/services/date-manipluation/date-manipluation.service';

@Module({
  controllers: [AppUserController],
  imports: [CloudinaryModule],
  providers: [
    AuthModule,
    AppUserService,
    PrismaService,
    JwtService,
    DateManipluationService,
  ],
})
export class AppUserModule {}
