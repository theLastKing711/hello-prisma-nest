import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAppUserController } from './customer-app-user.controller';
import { CustomerAppUserService } from './customer-app-user.service';

describe('CustomerAppUserController', () => {
  let controller: CustomerAppUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerAppUserController],
      providers: [CustomerAppUserService],
    }).compile();

    controller = module.get<CustomerAppUserController>(CustomerAppUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
