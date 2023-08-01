import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCategoryController } from './customer-category.controller';
import { CustomerCategoryService } from './customer-category.service';

describe('CustomerCategoryController', () => {
  let controller: CustomerCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerCategoryController],
      providers: [CustomerCategoryService],
    }).compile();

    controller = module.get<CustomerCategoryController>(CustomerCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
