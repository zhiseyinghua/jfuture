import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JPushSMSService } from '../jiguang/jpush-sms.service';

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
    return this.authService.signUp('authCredentialsDto');
  }

  /**
   * 发送极光短信
   * 前端传递一个手机号码和设备号，调用极光服务发送一个手机验证码
   */
  @Post('/seedjpushsms')
  sendJpushsms(@Body(ValidationPipe) sendData: SendPhone): any {
    console.log(this.log + 'sendJpushsms');
    return JPushSMSService.sendSMSVerficiationCode(sendData.mobile);
  }

  @Post('/verifysmscode')
  verifysmscode(@Body(ValidationPipe)data): any{
    console.log(this.log + '');
  }
}
