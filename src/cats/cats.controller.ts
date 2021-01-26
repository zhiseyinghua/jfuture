import { Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  @Get('abc')
   putOrder() {
    console.log('abc start');
    return CatsService.abc();
  }
}
