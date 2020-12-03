import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { AUTH_CONFIG } from './auth.config';
import { logindatainterface } from './auth.interface';
import uuid = require('uuid');

@Injectable()
export class AuthService {
  private logger = 'AuthService';
  signUp(user): Observable<any> {
    console.log(this.logger + 'jin ru AuthService');
    return DbElasticService.executeInEs(
      'get',
      { huangwenqiang: '123' },
      'auth',
    );
  }

  /**
   * 将用户注册信息存储到数据库
   * @param data 
   */
  storageUserlogindata(data: logindatainterface): Observable<any> {
    console.log();
    let eldata: logindatainterface = {
      hash: DynamoDBService.computeHash(AUTH_CONFIG.INDEX),
      range: uuid.v4(),
      index: 'user',
      email: '',
      encodepossword: data.encodepossword,
      phone: data.phone,
    };
    return DbElasticService.executeInEs(
      'put',
      eldata,
      AUTH_CONFIG.DOC + '/' + AUTH_CONFIG.INDEX,
    );
  }
}
