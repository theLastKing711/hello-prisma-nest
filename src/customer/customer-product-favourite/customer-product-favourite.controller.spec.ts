import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProductFavouriteController } from './customer-product-favourite.controller';

describe('CustomerProductFavouriteController', () => {
  let controller: CustomerProductFavouriteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerProductFavouriteController],
    }).compile();

    controller = module.get<CustomerProductFavouriteController>(CustomerProductFavouriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
