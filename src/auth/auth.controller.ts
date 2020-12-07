import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JPushSMSService } from '../jiguang/jpush-sms.service';
import {
  GetuserbyphonenumberInterface,
  Logindatainterface,
  LoginWithSMSVerifyCodeInput,
  SendPhoneSMS,
} from './auth.interface';
import { switchMap } from 'rxjs/operators';
import { DbElasticService } from 'src/service/es.service';
import { throwError } from 'rxjs';
import { dbinterface } from 'src/common/db.elasticinterface';

@Controller('auth')
export class AuthController {
  log = 'AuthController';
  constructor(private authService: AuthService) {}
  /**
   * 发送极光短信
   * 前端传递一个手机号码和设备号，调用极光服务发送一个手机验证码
   */
  @Post('/seedjpushsms')
  sendJpushsms(@Body(ValidationPipe) sendData: SendPhoneSMS): any {
    console.log(this.log + 'sendJpushsms');
    return JPushSMSService.sendSMSVerficiationCode(sendData.mobile);
  }

  /**
   * 用户注册
   * 1.验证手机发送的验证码是否正确
   * 2.将用户信息存储到数据库,返回idtoken到用户
   * @param data
   */
  @Post('/verifysmscoderegister')
  verifysmscoderegister(
    @Body(ValidationPipe) data: LoginWithSMSVerifyCodeInput,
  ): any {
    // console.log(this.log + '');
    return JPushSMSService.verifySmsCode({
      code: data.code,
      msg_id: data.msg_id,
      provider:data.provider
    }).pipe(
      switchMap((smsdataResult) => {
        if (smsdataResult['is_valid'] == true) {
          // 这里给的数据都是规范，在服务里重写了
          return AuthService.storageUserregisterdata({
            hash: '',
            range: '',
            index: '',
            email: '',
            phone: data.phone,
            encodepossword: data.encodepossword,
            timestamp: 0
          });
        } else {
          return throwError(new Error('ERROR'));
        }
      }),
    );
  }

  /**
   * 
   * @param data
   */
  @Post('logontest')
  setlocaltest(@Body(ValidationPipe) data: Logindatainterface): any {
    console.log('setlocaltest', 'data', data);
    return AuthService.storageUserregisterdata(data);
  }

  /**
   * 
   */
  @Post('/getuserauthtest')
  signUp(@Body(ValidationPipe) userRange: dbinterface): any {
    console.log('AuthController signup mode enter');
    return AuthService.getEsdbAuth(userRange);
  }

  /**
   * 根据
   */
  @Post('getuserbyphonenumber')
  getUserbyPhoneNumber(@Body(ValidationPipe) phone:GetuserbyphonenumberInterface): any {
    return AuthService.byphoneNumber(phone.phoneNumber);

  }
}
