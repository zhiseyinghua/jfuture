import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { SearchByUserid, UserInfoInterface } from './user.interface';
import { UserService } from './user.service';

@Controller('user')

export class UserController {
  log = 'UserController'
  constructor(private userService: UserService) { }

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
      usernickname: '',
      telephone: '',
      usermail: '',
      userico: '',
      authKey: {
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
        hash: 'DynamoDBService.computeHash(AUTH_CONFIG.INDEX)',
        range: 'uuid.v4()',
        index: 'user',
      }
    });
  }
  @Get('searchbyuserid')
  searchbyuserid(
    @Body(ValidationPipe) userid: SearchByUserid,
  ): any {
    return UserService.SearchUserInfo(userid.userid);
  }
} 
