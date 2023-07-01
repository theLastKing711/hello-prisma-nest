import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [CategoryController],
  imports: [CloudinaryModule],
  providers: [PrismaService, JwtService, CategoryService],
})
export class CategoryModule {}
