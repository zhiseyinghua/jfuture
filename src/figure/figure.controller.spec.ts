import { Test, TestingModule } from '@nestjs/testing';
import { FigureController } from './figure.controller';

describe('FigureController', () => {
  let controller: FigureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FigureController],
    }).compile();

    controller = module.get<FigureController>(FigureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
