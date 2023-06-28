import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppUserService } from './app-user.service';
import { CreateAppUserDto } from './dto/create-app-user.dto';
import { UpdateAppUserDto } from './dto/update-app-user.dto';

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
  async findAll() {
    return this.appUserService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appUserService.findOne({ id: +id });
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
