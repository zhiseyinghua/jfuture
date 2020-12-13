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
export class UserController {
  log = 'UserController'
  constructor(private userService: UserService) { }


  @Post('insertuserinfo')
  insertuserinfo(@Headers() headers): any {
    let idtoken = headers['authorization'];
    console.log(AuthService.decodeIdtoken(idtoken));
    let userinfo=AuthService.decodeIdtoken(idtoken);
    console.log(userinfo);
    return UserService.storeUserInfo({
      hash:userinfo.hash,
      range:userinfo.range,
      index:userinfo.index,
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
    })
  }
  @Post('updateuserinfo')
  updateuserinfo(@Headers() headers): any {
    let idtoken = headers['authorization'];
    console.log(AuthService.decodeIdtoken(idtoken));
    let userinfo=AuthService.decodeIdtoken(idtoken);
    console.log(userinfo);
    return UserService.UpdateUserInfo({
      hash:userinfo.hash,
      range:userinfo.range,
      index:userinfo.index,
          userid:'', 
          usernickname:'',
          telephone:'',
          usermail:'',
          userico:'',
          authKey:{
            hash: "123",
            range: "456",
            index: "",
        }}); } 
  @Post('searchbyuserid')
  searchbyuserid(
    @Body(ValidationPipe) userid: Dbinterface,
  ): any {
    return UserService.SearchUserInfo(userid.range);
  }
} 

