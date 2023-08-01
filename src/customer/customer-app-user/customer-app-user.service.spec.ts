import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAppUserService } from './customer-app-user.service';

describe('CustomerAppUserService', () => {
  let service: CustomerAppUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerAppUserService],
    }).compile();

    service = module.get<CustomerAppUserService>(CustomerAppUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
