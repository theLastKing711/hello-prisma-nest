import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';
import { Prisma } from '@prisma/client';

@Controller('app-user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Post()
  async create(@Body() createAppUserDto: CreateAppUserDto) {
    return this.appUserService.create({
      imagePath: createAppUserDto.imagePath,
      userName: createAppUserDto.userName,
      password: createAppUserDto.password,
    });
  }
  @Get()
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
    return this.appUserService.findAll(params || {});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const appUser = await this.appUserService.findOne({ id: +id });
      return appUser;
    } catch (err) {
      console.log('error status', err.status);
      throw new HttpException(
        'User with given id was not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // if (!appUser) {
    //   throw new HttpException(
    //     'User with given id was not found',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
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
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.appUserService.remove({ id: +id });
  }
}
