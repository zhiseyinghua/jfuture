<<<<<<< HEAD
import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { SearchByUserid, UserInfoInterface } from './user.interface';
import { UserService } from './user.service';

@Controller('user')

=======
import { Body, Controller, Get, Header, Headers, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Dbinterface } from 'src/common/db.elasticinterface';
import { Errorcode } from 'src/common/error.code';
import { UserInfoInterface } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
>>>>>>> dev-hxy
export class UserController {
  log = 'UserController'
  constructor(private userService: UserService) { }

<<<<<<< HEAD
  @Post('getuser')
  getuserinfo(@Body(ValidationPipe) data: UserInfoInterface): any {
    console.log('getuserinfo', 'data', data);
    return UserService.storeUserInfo(data);
  }

  @Post('insertuserinfo')
  insertuserinfo(): any {
    return UserService.storeUserInfo({
      hash: '',
      range: '',
      index: '',
      userid: '',
=======

  @Post('insertuserinfo')
  insertuserinfo(@Headers() headers): any {
    let idtoken = headers['authorization'];
    console.log(AuthService.decodeIdtoken(idtoken));
    let userinfo=AuthService.decodeIdtoken(idtoken);
    console.log(userinfo);
    return UserService.storeUserInfo({
      userid: '1',
>>>>>>> dev-hxy
      usernickname: '',
      telephone: '',
      usermail: '',
      userico: '',
      authKey: {
<<<<<<< HEAD
        hash: '123',
        range: '456',
        index: '789',
      }
    })
  }
  @Post('updateuserinfo')
  updateuserinfo(): any {
    return UserService.UpdateUserInfo({
      hash: '',
      range: '',
      index: '',
      userid: '',
      usernickname: '',
      telephone: '',
      usermail: '',
      userico: '',
      authKey: {
        hash: '',
        range: '',
        index: '',
      }
    });
  }
  @Post('searchbyuserid')
  searchbyuserid(
    @Body(ValidationPipe) userid: SearchByUserid,
  ): any {
    return UserService.SearchUserInfo(userid.userid);
  }
} 
=======
        hash:userinfo.hash,
        range:userinfo.range,
        index:userinfo.index,
      }
    }).pipe(
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }),
    );
  }
  @Post('updateuserinfo')
  updateuserinfo(@Headers() headers): any {
    let idtoken = headers['authorization'];
    console.log(AuthService.decodeIdtoken(idtoken));
    let userinfo=AuthService.decodeIdtoken(idtoken);
    console.log(userinfo);
    return UserService.UpdateUserInfo({
          userid:'123', 
          usernickname:'',
          telephone:'',
          usermail:'',
          userico:'',
          authKey:{
            hash:userinfo.hash,
            range:userinfo.range,
            index:userinfo.index,
        }}).pipe(
          catchError((err) => {
            console.log('updateuserinfo err.message',err.message);
            let redata: BackCodeMessage = {
             
              
              code: Errorcode[err.message],
              message: err.message,
            };
            return of(redata);
          }),
        );
       } 
  @Post('searchbyuserid')
  searchbyuserid(
    @Body(ValidationPipe) userid: Dbinterface,
  ): any {
    return UserService.SearchUserInfo(userid.range);
  }
} 


>>>>>>> dev-hxy
