import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ResponseReviewDto } from './dto/response-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.ReviewCreateInput): Promise<ResponseReviewDto> {
    const reviewDto = await this.prisma.review.create({
      data,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const reviewDtoNonDecimal: ResponseReviewDto = {
      ...reviewDto,
      rating: parseFloat(reviewDto.rating.toFixed(2)),
    };

    return reviewDtoNonDecimal;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReviewWhereUniqueInput;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }): Promise<ResponseReviewDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const reviewDtos = await this.prisma.review.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const reviewDtoNonDecimal = reviewDtos.map((x) => ({
      ...x,
      rating: parseFloat(x.rating.toFixed(2)),
    }));

    return reviewDtoNonDecimal;
  }

  async findOne(
    reviewWhereUniqueInput: Prisma.ReviewWhereUniqueInput,
  ): Promise<ResponseReviewDto | null> {
    const reviewModel = await this.prisma.review.findUnique({
      where: reviewWhereUniqueInput,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!reviewModel) {
      return null;
    }

    const responseDto: ResponseReviewDto = {
      ...reviewModel,
      rating: parseFloat(reviewModel.rating.toFixed(2)),
    };

    return responseDto;
  }

  async update(params: {
    where: Prisma.ReviewWhereUniqueInput;
    data: Prisma.ReviewUpdateInput;
  }): Promise<ResponseReviewDto> {
    const { where, data } = params;

    const reviewDto = await this.prisma.review.update({
      data,
      where,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const reviewDtoNonDecimal: ResponseReviewDto = {
      ...reviewDto,
      rating: parseFloat(reviewDto.rating.toFixed(2)),
    };

    return reviewDtoNonDecimal;
  }

  async remove(
    where: Prisma.ReviewWhereUniqueInput,
  ): Promise<ResponseReviewDto> {
    const reviewDto = await this.prisma.review.delete({
      where,
      include: {
        appUser: {
          select: {
            userName: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const reviewDtoNonDecimal: ResponseReviewDto = {
      ...reviewDto,
      rating: parseFloat(reviewDto.rating.toFixed(2)),
    };

    return reviewDtoNonDecimal;
  }
}
