import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/home-response.dto';
import { CurrentUserInterceptor } from 'src/auth/interceptor/CurrentUserInterceptor';
import { AppUser } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @UseInterceptors(CurrentUserInterceptor)
  async findAll(@Req() request: Request & { currentUser: AppUser | null }) {
    const userId = request.currentUser ? request.currentUser.id : undefined;
    const featuredProductListDto = await this.homeService.findFeaturedProducts(
      userId,
    );

    const latestProductsDto = await this.homeService.findLatestProducts(userId);

    const latestBestSellerProductsDto =
      await this.homeService.findLatestBestSellerProducts(userId);

    const latestFeatuerdProductsDto =
      await this.homeService.findLatestFeaturedProducts(userId);

    const responseDto: HomeResponseDto = {
      featuredProducts: featuredProductListDto,
      latestProducts: latestProductsDto,
      bestSellerProducts: latestBestSellerProductsDto,
      latestFeaturedProducts: latestFeatuerdProductsDto,
    };

    return responseDto;
  }
}
