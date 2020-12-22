import { Body, Controller, Get, Header, Headers, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Observable, of, pipe, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CreateIdtokenInterface } from 'src/auth/auth.interface';
import { AuthService } from 'src/auth/auth.service';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Dbinterface } from 'src/common/db.elasticinterface';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { USER_CONFIG } from './user.config';
import { UserInfo, UserInfoInterface } from './user.interface';
import { UserService } from './user.service';
import uuid = require('uuid');
import { Errorcode } from 'src/common/error.code';
import { UsererrorCode } from './UsererrorCode';

@Controller('user')
export class UserController {
  log = 'UserController'
  constructor(private userService: UserService) { }

  @Post('insertuserinfo')
  insertuserinfo(@Body(ValidationPipe) sendData: UserInfoInterface, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let userinfo = AuthService.decodeIdtoken(idtoken);
    return UserService.storeUserInfo({
      hash: DynamoDBService.computeHash(USER_CONFIG.INDEX),
      range: uuid.v4(),
      index: USER_CONFIG.INDEX,
      usernickname: sendData.usernickname,
      telephone: sendData.telephone,
      usermail: sendData.usermail,
      userico: sendData.userico,
      introduction:sendData.introduction,
      profession:sendData.profession,
      birthday:sendData.birthday,
      age:sendData.age,
      authKey: {
        hash: userinfo.hash,
        range: userinfo.range,
        index: userinfo.index,
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
  updateuserinfocontroller(@Body(ValidationPipe) sendData: UserInfoInterface, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let userinfo = AuthService.decodeIdtoken(idtoken);
    let vertifyInfo = {
      hash: userinfo.hash,
      range: userinfo.range,
      index: userinfo.index,
    }
    return UserService.ByAuthkey(vertifyInfo)
      .pipe(
        switchMap((data) => {
          console.log('updateuserinfocontroller ByAuthkey data', data);
          if (data && data.range ) {
            // console.log('1111111111111111111111111',data)
            return UserService.UpdateUserInfo({
              usernickname: data.usernickname,
              telephone: data.telephone,
              usermail: data.usermail,
              userico: data.userico,
              introduction:data.introduction,
              profession:data.profession,
              birthday:data.birthday,
              age:data.age,
              hash:data.hash,
              range:data.range,
              index:data.index
            })
          } else if (data == 'user_error') {
            throwError(new Error('cun zai liang ge yong hu '))
          } else if (data == false) {
            return UserService.storeUserInfo({
              usernickname: sendData.usernickname,
              telephone: sendData.telephone,
              usermail: sendData.usermail,
              userico: sendData.userico,
              introduction:sendData.introduction,
              profession:sendData.profession,
              birthday:sendData.birthday,
              age:sendData.age,
              authKey: vertifyInfo
            })
          }
          else {
            // TODO:
            // return UserService.storeUserInfo({
            //   usernickname: data.usernickname,
            //   telephone: data.telephone,
            //   usermail: data.usermail,
            //   userico: data.userico,
            //   authKey: data.authKey
            // })
          } 
        }),
        catchError((err) => {
          console.log(
            this.log + 'update error',
            JSON.stringify(err),
            typeof err,
            err.message,
          );
          let redata: BackCodeMessage = {
            code: Errorcode[err.message],
            message: err.message,
          };
          return of(redata);
        })
      )
  }


  @Post('searchbyuserid')
  searchbyuserid(
    @Body(ValidationPipe) userid: Dbinterface,
  ): any {
    return UserService.SearchUserInfo(userid.range);
  }
}
