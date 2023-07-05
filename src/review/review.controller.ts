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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  convertStringToBoolean(value: string) {
    if (value === 'true') return true;

    return false;
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    const createdReviewDto = await this.reviewService.create({
      body: createReviewDto.body,
      rating: createReviewDto.rating,
      appUser: {
        connect: {
          id: createReviewDto.appUserId,
        },
      },
      product: {
        connect: {
          id: createReviewDto.productId,
        },
      },
    });

    return createdReviewDto;
  }

  @Get()
  async findAll(
    params:
      | {
          skip?: number;
          take?: number;
          cursor?: Prisma.ReviewWhereUniqueInput;
          where?: Prisma.ReviewWhereInput;
          orderBy?: Prisma.ReviewOrderByWithRelationInput;
        }
      | undefined,
  ) {
    const reviewDtos = await this.reviewService.findAll(params || {});

    return reviewDtos;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reviewDto = await this.reviewService.findOne({ id: +id });

    if (!reviewDto) {
      throw new HttpException('Review was not found', HttpStatus.NOT_FOUND);
    }

    return reviewDto;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const reviewDto = await this.reviewService.findOne({ id: +id });

    if (!reviewDto) {
      throw new HttpException('Review was not found', HttpStatus.NOT_FOUND);
    }

    const updatedReviewDto = await this.reviewService.update({
      where: {
        id: +id,
      },
      data: {
        body: updateReviewDto.body,
        rating: updateReviewDto.rating,
        appUser: {
          connect: {
            id: updateReviewDto.appUserId,
          },
        },
        product: {
          connect: {
            id: updateReviewDto.productId,
          },
        },
      },
    });

    return updatedReviewDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isReviewAvailable = this.reviewService.findOne({ id: +id });

    if (!isReviewAvailable) {
      throw new HttpException('Review was not found', HttpStatus.NOT_FOUND);
    }

    const reviewDto = await this.reviewService.remove({ id: +id });

    return reviewDto;
  }
}
