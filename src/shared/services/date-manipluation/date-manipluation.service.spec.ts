import { Test, TestingModule } from '@nestjs/testing';
import { DateManipluationService } from './date-manipluation.service';

describe('DateManipluationService', () => {
  let service: DateManipluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateManipluationService],
    }).compile();

    service = module.get<DateManipluationService>(DateManipluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
