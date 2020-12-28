import { Test, TestingModule } from '@nestjs/testing';
import { AliyunController } from './aliyun.controller';

describe('AliyunController', () => {
  let controller: AliyunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliyunController],
    }).compile();

    controller = module.get<AliyunController>(AliyunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
