import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { UserInfoInterface } from './user.interface';
import { UserService } from './user.service';

@Controller('user')

export class UserController {
    log='UserController'
    constructor(private userService: UserService) {}

    @Post('getuser')
    getuserinfo(@Body(ValidationPipe) data: UserInfoInterface): any {
      console.log('getuserinfo', 'data', data);
      return UserService.storeUserInfo(data);
    }
    
    @Get('/insertuserinfo')
    insertuserinfo():any{
      return UserService.storeUserInfo({
        hash:'',
        range: '',
        index: '',
        userid:'',
        usernickname:'',
        telephone:'',
        usermail:'',
        userico:'',
        authKey:{
          hash: 'DynamoDBService.computeHash(AUTH_CONFIG.INDEX)',
          range: 'uuid.v4()',
          index: 'user',
        }
      });
    }
    @Get('/updateuserinfo')
    updateuserinfo():any{
      return UserService.UpdateUserInfo({
        hash:'',
        range: '',
        index: '',
        userid:'',
        usernickname:'',
        telephone:'',
        usermail:'',
        userico:'',
        authKey:{
          hash: 'DynamoDBService.computeHash(AUTH_CONFIG.INDEX)',
          range: 'uuid.v4()',
          index: 'user',
        }
      });
    }
    @Get('/searchuserinfo')
    searchuserinfo():any{
    }
  } 
