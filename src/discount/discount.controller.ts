import { DateManipluationService } from './../shared/services/date-manipluation/date-manipluation.service';
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
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { SortDiscountDto } from './dto/sort-discount.dto';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly dateManipluationService: DateManipluationService,
  ) {}

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
    @Query()
    queryParams: SortDiscountDto,
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

    const discountModels = await this.discountService.findAll({
      where: wherePrismaFilter,
      skip: +queryParams.offset,
      take: +queryParams.limit,
      orderBy,
    });

    const listCount = await this.discountService.getTotalCount();

    return { data: discountModels, total: listCount };
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
