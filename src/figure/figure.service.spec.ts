import { Test, TestingModule } from '@nestjs/testing';
import { FigureService } from './figure.service';

describe('FigureService', () => {
  let service: FigureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FigureService],
    }).compile();

    service = module.get<FigureService>(FigureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
