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
  static signU(arg0: string): any {
    throw new Error('Method not implemented.');
  }
  public static logger = 'AuthService';
  /**
   * 查询es里的user字段
   * @param user
   */
  // public static getEsdbAuth(userRange: string): Observable<any> {
  //   let eldata: logindatainterface = {
  //     hash: DynamoDBService.computeHash(AUTH_CONFIG.INDEX),
  //     range: uuid.v4(),
  //     index: 'user',
  //     email: '',
  //     encodepossword: data.encodepossword,
  //     phone: data.phone,
  //   };
  //   return DbElasticService.executeInEs(
  //     'get',
  //     { huangwenqiang: '123' },
  //     'auth',
  //   );
  // }

  /**
   * 将用户注册信息存储到数据库
   * @param data
   */
  static storageUserlogindata(data: logindatainterface): Observable<any> {
    console.log(this.logger + 'storageUserlogindata data', data);
    let eldata: logindatainterface = {
      hash: DynamoDBService.computeHash(AUTH_CONFIG.INDEX),
      range: uuid.v4(),
      index: 'user',
      email: '',
      encodepossword: data.encodepossword,
      phone: data.phone,
    };
    console.log(this.logger + 'storageUserlogindata data', data);
    console.log(this.logger, 'storageUserlogindata eldata', eldata);
    return DbElasticService.executeInEs(
      'put',
      eldata,
      AUTH_CONFIG.DOC + '/' + AUTH_CONFIG.INDEX + '/' + eldata.range,
    );
  }
}