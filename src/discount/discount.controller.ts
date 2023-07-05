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
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    const createdDiscountModel = await this.discountService.create({
      product: {
        connect: {
          id: createDiscountDto.productId,
        },
      },
      value: createDiscountDto.value,
      startDate: createDiscountDto.startDate,
      endDate: createDiscountDto.endDate,
    });

    return createdDiscountModel;
  }

  @Get()
  async findAll(
    params:
      | {
          skip?: number;
          take?: number;
          cursor?: Prisma.DiscountWhereUniqueInput;
          where?: Prisma.DiscountWhereInput;
          orderBy?: Prisma.DiscountOrderByWithRelationInput;
        }
      | undefined,
  ) {
    const discountModels = await this.discountService.findAll({});

    return discountModels;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const DiscountDto = await this.discountService.findOne({ id: +id });

    if (!DiscountDto) {
      throw new HttpException('Discount was not found', HttpStatus.NOT_FOUND);
    }

    return DiscountDto;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    const discountModel = await this.discountService.findOne({ id: +id });

    if (!discountModel) {
      throw new HttpException('Discount was not found', HttpStatus.NOT_FOUND);
    }

    const updatedDiscountDto = await this.discountService.update({
      where: {
        id: +id,
      },
      data: {
        product: {
          connect: {
            id: updateDiscountDto.productId,
          },
        },
        value: updateDiscountDto.value,
        startDate: updateDiscountDto.startDate,
        endDate: updateDiscountDto.endDate,
      },
    });

    return updatedDiscountDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const DiscountDto = await this.discountService.findOne({ id: +id });

    if (!DiscountDto) {
      throw new HttpException('Discount was not found', HttpStatus.NOT_FOUND);
    }

    return this.discountService.remove({ id: +id });
  }
}
