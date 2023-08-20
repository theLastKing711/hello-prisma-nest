import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProductFavouriteService } from './customer-product-favourite.service';

describe('CustomerProductFavouriteService', () => {
  let service: CustomerProductFavouriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerProductFavouriteService],
    }).compile();

    service = module.get<CustomerProductFavouriteService>(CustomerProductFavouriteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
