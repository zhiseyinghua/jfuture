import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JPushSMSService } from '../jiguang/jpush-sms.service';
import {
  GetuserbyphonenumberInterface,
  Logindatainterface,
  LoginWithSMSVerifyCodeInput,
  SendPhoneSMS,
  AuthuserInterface,
} from './auth.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Dbinterface } from 'src/common/db.elasticinterface';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { autherrorCode } from './auth.code';
import { Errorcode } from 'src/common/error.code';

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
    console.log(this.log + 'verifysmscoderegister start');

    return AuthService.byphoneNumber(data.phone).pipe(
      switchMap((result) => {
        if (result == false) {
          return JPushSMSService.verifySmsCode({
            code: data.code,
            msg_id: data.msg_id,
            provider: data.provider,
          });
        } else {
          // let backMessage: BackCodeMessage = {
          //   code: 'auth0001',
          //   message: autherrorCode.the_user_already_exists,
          // };
          return throwError(new Error(autherrorCode.the_user_already_exists));
        }
      }),
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
            timestamp: 0,
            role: 'menber',
          });
        } else {
          return throwError(new Error(autherrorCode.verification_code_error));
        }
      }),
      catchError((err) => {
        console.log(
          this.log + 'verifysmscoderegister yicunz catcherror',
          JSON.stringify(err),
          typeof err,
          err.message,
        );
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }),
    );
  }

  /**
   * 根据手机号码
   */
  @Post('getuserbyphonenumber')
  getUserbyPhoneNumber(
    @Body(ValidationPipe) phone: GetuserbyphonenumberInterface,
  ): any {
    return AuthService.byphoneNumber(phone.phoneNumber);
  }

  @Post('shengchengidtokentest')
  shengchengidtokentest(): any {
    return AuthService.getEsdbAuth({
      hash: '',
      range: '32d75c79-528a-4a64-a67c-de133f06a4ae',
      index: 'auth',
    }).pipe(
      /**
       * 获取用户的信息
       */
      switchMap((data: AuthuserInterface) => {
        let authData: AuthuserInterface = {
          hash: data.hash,
          range: data.range,
          index: data.index,
          role: data.role,
          phone: data.phone,
          timestamp: data.timestamp,
          realname: data.realname
        };
        return of(authData);
      }),
      switchMap((data: AuthuserInterface) => {
        return AuthService.createjwtToken(data);
      }),
    );
  }

  @Post('upidtokentest')
  upidtoken(): any {
    return AuthService.upjwttokenkey({
      hash: 'auth-2020-12-08',
      range: '32d75c79-528a-4a64-a67c-de133f06a4ae',
      index: 'user',
    });
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
  @Post('getuserauthtest')
  signUp(@Body(ValidationPipe) userRange: Dbinterface): any {
    console.log('AuthController signup mode enter');
    return AuthService.getEsdbAuth(userRange);
  }
}
