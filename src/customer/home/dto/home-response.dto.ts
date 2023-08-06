import { FeaturedProductListDto } from './featured-product-list.dto';
import { LatestProductListDto } from './latest-products-list.dto';
export class HomeResponseDto {
  featuredProducts: FeaturedProductListDto[];
  latestProducts: LatestProductListDto[];
  bestSellerProducts: LatestProductListDto[];
  latestFeaturedProducts: LatestProductListDto[];
}
