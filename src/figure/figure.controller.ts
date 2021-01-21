import { Body, Controller, Headers, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PutOrderOne } from './figure.interface';
import { FigureService } from './figure.service';

@Controller('figure')
export class FigureController {
  log = 'AuthController';
  // 向数据库put一个订单
  //   constructor(private authService: AuthService) {}
  @Post('/putorder')
  putOrder( @Body(ValidationPipe) data: PutOrderOne, @Headers() headers){
    console.log('FigureController putOrder start')
    let idtoken = headers['authorization'];
    let authdata = AuthService.decodeIdtoken(idtoken);
    return FigureService.putOrder(data,{hash:authdata.hash,range:authdata.range,index:authdata.range})
  }
}
