import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DbElasticService } from 'src/service/es.service';

@Injectable()
export class AuthService {
  private logger = 'AuthService';
  signUp(user): Observable<any> {
    console.log(this.logger+'jin ru AuthService')
    return DbElasticService.executeInEs('get',{'huangwenqiang':'123'},'auth')
  }
}
