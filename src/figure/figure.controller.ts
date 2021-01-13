import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { PutOrderOne } from './figure.interface';
import { FigureService } from './figure.service';

@Controller('figure')
export class FigureController {
  log = 'AuthController';
  // 向数据库put一个订单
  //   constructor(private authService: AuthService) {}
  @Post('/putorder')
  putOrder( @Body(ValidationPipe) data: PutOrderOne){
    console.log('FigureController putOrder start')
    return FigureService.putOrder(data,{hash:'',range:'',index:''})
  }
}
