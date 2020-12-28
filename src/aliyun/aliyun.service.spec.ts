import { Test, TestingModule } from '@nestjs/testing';
import { AliyunService } from './aliyun.service';

describe('AliyunService', () => {
  let service: AliyunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AliyunService],
    }).compile();

    service = module.get<AliyunService>(AliyunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
