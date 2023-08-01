import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProductController } from './customer-product.controller';
import { CustomerProductService } from './customer-product.service';

describe('CustomerProductController', () => {
  let controller: CustomerProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerProductController],
      providers: [CustomerProductService],
    }).compile();

    controller = module.get<CustomerProductController>(CustomerProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
