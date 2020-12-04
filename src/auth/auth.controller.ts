import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JPushSMSService } from '../jiguang/jpush-sms.service';
import {
  logindatainterface,
  LoginWithSMSVerifyCodeInput,
  SendPhoneSMS,
} from './auth.interface';
import { switchMap } from 'rxjs/operators';
import { DbElasticService } from 'src/service/es.service';
import { throwError } from 'rxjs';

@Controller('auth')
export class AuthController {
  log = 'AuthController';
  constructor(private authService: AuthService) {}
  /**
   * 用户注册
   */
  @Post('/signup')
  signUp(): any {
    console.log('AuthController signup mode enter');
    return AuthService.signU('authCredentialsDto');
  }

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
  @Post('/verifysmscodelogin')
  verifysmscodelogin(
    @Body(ValidationPipe) data: LoginWithSMSVerifyCodeInput,
  ): any {
    // console.log(this.log + '');
    return JPushSMSService.verifySmsCode({
      code: data.code,
      msg_id: data.msg_id,
    }).pipe(
      switchMap((smsdataResult) => {
        if (smsdataResult['is_valid'] == true) {
          return AuthService.storageUserlogindata({
            hash: '',
            range: '',
            index: '',
            email: '',
            phone: data.phone,
            encodepossword: data.encodepossword,
          });
        } else {
          return throwError(new Error('ERROR'));
        }
      }),
    );
  }

  /**
   * 用户注册或登录
   * @param data
   */
  @Post('logontest')
  setlocaltest(@Body(ValidationPipe) data: logindatainterface): any {
    console.log('setlocaltest', 'data', data);
    return AuthService.storageUserlogindata(data);
  }
}
