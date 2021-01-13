import { Test, TestingModule } from '@nestjs/testing';
import { TeammemberService } from './teammember.service';

describe('TeammemberService', () => {
  let service: TeammemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeammemberService],
    }).compile();

    service = module.get<TeammemberService>(TeammemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
