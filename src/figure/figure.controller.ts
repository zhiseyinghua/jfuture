import {
  Body,
  Controller,
  Headers,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Dbinterface, Getfigure } from 'src/common/db.elasticinterface';
import {
  ByOrderTimeInterface,
  PutOrderOne,
  UpdateFirstinformation,
  UpdateOneMessage,
  UpdateOtherFormation,
  UpdateTime,
} from './figure.interface';
import { FigureService } from './figure.service';

@Controller('api/figure')
export class FigureController {
  log = 'AuthController';
  // 向数据库put一个订单
  //   constructor(private authService: AuthService) {}
  @Post('/putorder')
  putOrder(@Body(ValidationPipe) data: PutOrderOne, @Headers() headers) {
    console.log('FigureController putOrder start');
    let idtoken = headers['authorization'];
    let authdata = AuthService.decodeIdtoken(idtoken);
    return FigureService.putOrder(data, {
      hash: authdata.hash,
      range: authdata.range,
      index: authdata.range,
    });
  }
  //删除订单
  @Post('/deleteorder')
  deleteOrder(@Body(ValidationPipe) data: PutOrderOne, @Headers() headers) {
    console.log('FigureController deleteOrder start');
    let idtoken = headers['authorization'];
    let authdata = AuthService.decodeIdtoken(idtoken);
    console.log(authdata)
    return FigureService.deleteOrder(data, {
      hash: data.hash,
      range: data.range,
      index: data.range,
    });
  }
  /**
   * 向数据库更新甲方信息
   * @param data
   */
  @Post('/firstinformation')
  firstinformationController(
    @Body(ValidationPipe) data: UpdateFirstinformation,
  ) {
    return FigureService.firstinformation(data);
  }

  /**
   * 更新其他信息
   * @param data
   */
  @Post('other_information')
  otherInformation(@Body(ValidationPipe) data: UpdateOtherFormation) {
    return FigureService.otherInformation(data);
  }

  /**
   * 更新order表中的一个数据
   * @param data
   */
  @Post('/one_message')
  oneMessage(@Body(ValidationPipe) data: UpdateOneMessage) {
    return FigureService.updateOneMessage(data);
  }

  /**
   * 更新任务的时间信息
   * @param data
   */
  @Post('/update_time')
  updateTime(@Body(ValidationPipe) data: UpdateTime) {
    return FigureService.updateTime(data);
  }

  @Post('/getfigure')
  getfigure(@Body(ValidationPipe) data: Getfigure) {
    return FigureService.getdbfigure(data.from, data.size);
  }
  @Post('/by_key_getfigure')
  byKeygetfigure(@Body(ValidationPipe) data: Dbinterface) {
    return FigureService.bykeygetorder(data);
  }
  @Post('/order_end_time_order')
  byOrderEndTime(@Body(ValidationPipe) data: Getfigure) {
    return FigureService.byOrderEndTimeOrder(data.from, data.size);
  }
  @Post('/order_time_order')
  byOrderTime(@Body(ValidationPipe) data: ByOrderTimeInterface) {
    // return FigureService.byOrderEndTimeOrder(data.timeWhich, data.maxtime,data.mintime);
    return FigureService.byOrderTimeOrder(
      data.timeWhich,
      data.maxtime,
      data.mintime,
    );
  }
}
