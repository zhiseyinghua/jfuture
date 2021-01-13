import { Controller, Post } from '@nestjs/common';

@Controller('figure')
export class FigureController {
  log = 'AuthController';
  //   constructor(private authService: AuthService) {}
  @Post('/seedjpushsms')
  putOrder(){
      return '123'
  }
}
