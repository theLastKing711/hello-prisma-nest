import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/home-response.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async findAll() {
    const featuredProductListDto =
      await this.homeService.findFeaturedProducts();

    const latestProductsDto = await this.homeService.findLatestProducts();

    const latestBestSellerProductsDto =
      await this.homeService.findLatestBestSellerProducts();

    const latestFeatuerdProductsDto =
      await this.homeService.findLatestFeaturedProducts();

    const responseDto: HomeResponseDto = {
      featuredProducts: featuredProductListDto,
      latestProducts: latestProductsDto,
      bestSellerProducts: latestBestSellerProductsDto,
      latestFeaturedProducts: latestFeatuerdProductsDto,
    };

    return responseDto;
  }
}
