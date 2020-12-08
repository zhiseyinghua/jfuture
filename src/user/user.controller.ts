import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UserInfoInterface } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    log='UserController'
    constructor(private userService: UserService) {}

    @Post('getusser')
    getuserinfo(@Body(ValidationPipe) data: UserInfoInterface): any {
      console.log('getuserinfo', 'data', data);
      return UserService.storeUserInfo(data);
    }
    
    @Get('/InsertUesrInfo')
    InsertUesrInfo():any{
      return UserService.storeUserInfo({
        hash:'',
        range: '',
        index: '',
        userid:'',
        usernickname:'',
        telephone:'',
        usermail:'',
        userico:'',
      });
  } 
}
