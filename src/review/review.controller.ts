import { DateManipluationService } from 'src/shared/services/date-manipluation/date-manipluation.service';
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
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { SortReviewDto } from './dto/sortReviewDto';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly dateManipluationService: DateManipluationService,
  ) {}

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
          cursor?: Prisma.DiscountWhereUniqueInput;
          where?: Prisma.DiscountWhereInput;
          orderBy?: Prisma.DiscountOrderByWithRelationInput;
        }
      | undefined,
    @Query()
    queryParams: SortReviewDto,
  ) {
    
    const [sortKey, sortValue] = queryParams.sort?.[0]?.split(',');

    const filterRecord: Record<string, string> | undefined =
      queryParams.filter?.reduce((prev, curr) => {
        const [filterkey, , filterValue] = curr.split('||');
        prev[filterkey] = filterValue;

        return prev;
      }, {});

    const productNameFilter = filterRecord?.product_name_search ?? undefined;

    const wherePrismaFilter: Prisma.DiscountWhereInput | undefined =
      queryParams.filter
        ? {
            product: {
              name: {
                startsWith: productNameFilter,
              },
            },
            ...(filterRecord.time_applied &&
              filterRecord.time_applied == 'this month' && {
                createdAt: {
                  gt: this.dateManipluationService.getLastMonthDate(),
                },
              }),
            ...(filterRecord.time_applied &&
              filterRecord.time_applied == 'this year' && {
                createdAt: {
                  gt: this.dateManipluationService.getLastYearDate(),
                },
              }),
          }
        : undefined;

    const orderBy: Prisma.DiscountOrderByWithRelationInput | undefined =
      sortKey && sortValue
        ? {
            ...(sortKey === 'id' && {
              id: sortValue === 'ASC' ? 'asc' : 'desc',
            }),
            ...(sortKey === 'startDate' && {
              startDate: sortValue === 'ASC' ? 'asc' : 'desc',
            }),
            ...(sortKey === 'endDate' && {
              endDate: sortValue === 'ASC' ? 'asc' : 'desc',
            }),
            ...(sortKey === 'value' && {
              value: sortValue === 'ASC' ? 'asc' : 'desc',
            }),
            ...(sortKey === 'product' && {
              product: {
                name: sortValue === 'ASC' ? 'asc' : 'desc',
              },
            }),
          }
        : undefined;

    const reviewModels = await this.reviewService.findAll({
      where: wherePrismaFilter,
      skip: +queryParams.offset,
      take: +queryParams.limit,
      orderBy,
    });

    const listCount = await this.reviewService.getTotalCount();

    return { data: reviewModels, total: listCount };
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
