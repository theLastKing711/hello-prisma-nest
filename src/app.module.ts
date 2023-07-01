import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUserModule } from './app-user/app-user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/guard/roles.guard';
import { AppUserService } from './app-user/app-user.service';
import { PrismaService } from './prisma.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageService } from './shared/services/image/image.service';

@Module({
  imports: [AppUserModule, AuthModule, CloudinaryModule],
  controllers: [AppController],
  providers: [
    AppUserService,
    PrismaService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    ImageService,
  ],
})
export class AppModule {}
