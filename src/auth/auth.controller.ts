import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Headers,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JPushSMSService } from '../jiguang/jpush-sms.service';
import {
  GetuserbyphonenumberInterface,
  Logindatainterface,
  LoginWithSMSVerifyCodeInput,
  SendPhoneSMS,
  AuthuserInterface,
  CreateIdtokenInterface,
  AuthuserIdtokenInterface,
} from './auth.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Dbinterface } from 'src/common/db.elasticinterface';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { AutherrorCode } from './auth.code';
import { Errorcode } from 'src/common/error.code';
import { AuthGuard } from './auth.guard';

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
          return throwError(new Error(AutherrorCode.the_user_already_exists));
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
          return throwError(new Error(AutherrorCode.verification_code_error));
        }
      }),
      switchMap((authdata: AuthuserInterface) => {
        return AuthService.createjwtToken({
          hash: authdata.hash,
          range: authdata.range,
          index: authdata.range,
          phone: authdata.phone,
          role: authdata.role,
          timestamp: authdata.timestamp,
          realname: authdata.realname,
        });
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
   * 根据手机号码登录
   */
  @Post('byusermimalogin')
  getUserbyPhoneNumber(
    @Body(ValidationPipe) mimaLogindata: GetuserbyphonenumberInterface,
  ): any {
    return AuthService.byphoneNumber(mimaLogindata.phone).pipe(
      switchMap((resultdata) => {
        if (
          resultdata.encodepossword &&
          resultdata.encodepossword == mimaLogindata.encodepossword
        ) {
          return of(resultdata);
        } else if (resultdata == false) {
          return throwError(new Error(AutherrorCode.The_user_does_not_exist));
        } else if (
          resultdata.encodepossword &&
          resultdata.encodepossword != mimaLogindata.encodepossword
        ) {
          return throwError(new Error(AutherrorCode.wrong_password));
        }
      }),
      // 给用户办法token
      switchMap((authdata: AuthuserInterface) => {
        return AuthService.createjwtToken({
          hash: authdata.hash,
          range: authdata.range,
          index: authdata.range,
          phone: authdata.phone,
          role: authdata.role,
          timestamp: authdata.timestamp,
          realname: authdata.realname,
        });
      }),
      catchError((err) => {
        console.log(err);
        let backMessage: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(backMessage);
      }),
    );
  }

  /**
   * 通过电话号码验证更换密码
   * @param data
   */
  @Post('byphoneresetpossword')
  byphoneResetPossword(
    @Body(ValidationPipe) data: LoginWithSMSVerifyCodeInput,
  ) {
    return AuthService.byphoneNumber(data.phone).pipe(
      switchMap((result) => {
        if (result == true) {
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
          return throwError(new Error(AutherrorCode.The_user_does_not_exist));
        }
      }),
      switchMap((smsdataResult) => {
        if (smsdataResult['is_valid'] == true) {
          // 更新密码
          return AuthService.resetpossword(data.phone, data.encodepossword);
        } else {
          return throwError(new Error(AutherrorCode.verification_code_error));
        }
      }),
      switchMap((authdata: AuthuserInterface) => {
        return AuthService.createjwtToken({
          hash: authdata.hash,
          range: authdata.range,
          index: authdata.range,
          phone: authdata.phone,
          role: authdata.role,
          timestamp: authdata.timestamp,
          realname: authdata.realname,
        });
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
   * 通过一个快过期的有效的token换取一个新的token
   * @param headers
   */
  @Post('bytokengettoken')
  verify(@Headers() headers): any {
    let idtoken = headers['authorization'];
    console.log('auth_controller bytokengettoken idtoken', idtoken, headers);
    return AuthService.verifyIdtoken(idtoken).pipe(
      switchMap((data) => {
        return AuthService.getEsdUser({
          hash: data.hash,
          range: data.range,
          index: data.index,
        });
      }),
      switchMap((data: AuthuserInterface) => {
        let authData: CreateIdtokenInterface = {
          hash: data.hash,
          range: data.range,
          index: data.index,
          role: data.role,
          phone: data.phone,
          timestamp: data.timestamp,
          realname: data.realname,
        };
        return of(authData);
      }),
      switchMap((data: AuthuserInterface) => {
        return AuthService.createjwtToken(data);
      }),
      catchError((err) => {
        return of(AutherrorCode.toeken_expired);
      }),
    );
  }

  @Post('phonereasttest')
  reastPossword(): any {
    return AuthService.resetpossword('18779868515', '123654').pipe(
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }),
    );
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
        let authData: CreateIdtokenInterface = {
          hash: data.hash,
          range: data.range,
          index: data.index,
          role: data.role,
          phone: data.phone,
          timestamp: data.timestamp,
          realname: data.realname,
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

  @Post('logontest2')
  @UseGuards(AuthGuard)
  setlocaltest2(@Body(ValidationPipe) data: Logindatainterface): any {
    console.log('setlocaltest', 'data', data);
    return AuthService.storageUserregisterdata(data);
  }
}