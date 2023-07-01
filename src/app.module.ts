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
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AppUserModule, AuthModule, CloudinaryModule, CategoryModule, ProductModule],
  controllers: [AppController],
  providers: [
    ImageService,
    PrismaService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppUserService,
    CategoryModule,
  ],
})
export class AppModule {}
