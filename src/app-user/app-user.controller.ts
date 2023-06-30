import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Prisma, Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('app-user')
@UseGuards(AuthGuard)
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagePath'))
  async create(
    @UploadedFile() imagePath,
    @Body() createAppUserDto: CreateAppUserDto,
  ) {
    console.log('image path');
    return this.appUserService.create({
      imagePath: createAppUserDto.imagePath,
      userName: createAppUserDto.userName,
      password: createAppUserDto.password,
      role: createAppUserDto.role || Role.Admin,
    });
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(
    params:
      | {
          skip?: number;
          take?: number;
          cursor?: Prisma.AppUserWhereUniqueInput;
          where?: Prisma.AppUserWhereInput;
          orderBy?: Prisma.AppUserOrderByWithRelationInput;
        }
      | undefined,
  ) {
    console.log('zolo 2');
    return this.appUserService.findAll(params || {});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const appUser = await this.appUserService.findOne({ id: +id });
    return appUser;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppUserDto: UpdateAppUserDto,
  ) {
    return this.appUserService.update({
      where: {
        id: +id,
      },
      data: {
        imagePath: updateAppUserDto.imagePath,
        userName: updateAppUserDto.userName,
        password: updateAppUserDto.password,
        role: updateAppUserDto.role || 'Admin',
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.appUserService.remove({ id: +id });
  }
}
