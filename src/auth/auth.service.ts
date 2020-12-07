import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { AUTH_CONFIG } from './auth.config';
import { Logindatainterface } from './auth.interface';
import uuid = require('uuid');
import {
  DbElasticinterfacePutReturn,
  dbinterface,
} from 'src/common/db.elasticinterface';
import { switchMap } from 'rxjs/operators';
var jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  public static logger = 'AuthService';
  /**
   * 查询es里的user字段
   * @param user
   */
  public static getEsdbAuth(userRange: dbinterface): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      AUTH_CONFIG.DOC + '/' + AUTH_CONFIG.INDEX + '/' + userRange.range,
    );
  }

  /**
   * 根据手机号查询用户，如果不存在返回false,存在则返回用户数据
   * @param phone 电话号码
   */
  public static byphoneNumber(phone: string): Observable<any> {
    let querydata = {
      query: {
        term: {
          'phone.keyword': '18779868511',
        },
      },
    };
    return DbElasticService.executeInEs(
      'get',
      AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.SEARCH,
      querydata,
    );
  }

  /**
   * 将用户注册信息存储到数据库
   * @param data
   */
  static storageUserregisterdata(data: Logindatainterface): Observable<any> {
    console.log(this.logger + 'storageUserlogindata data', data);
    let eldata: Logindatainterface = {
      hash: DynamoDBService.computeHash(AUTH_CONFIG.INDEX),
      range: uuid.v4(),
      index: 'user',
      email: '',
      encodepossword: data.encodepossword,
      phone: data.phone,
      timestamp: new Date().valueOf(),
    };
    console.log(this.logger + 'storageUserlogindata data', data);
    console.log(this.logger, 'storageUserlogindata eldata', eldata);

    return DbElasticService.executeInEs(
      'put',
      AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.DOC + '/' + eldata.range,
      eldata,
    ).pipe(
      // 查询
      switchMap((result: DbElasticinterfacePutReturn) => {
        if (result.found == true) {
          return result._source;
        } else {
          return;
        }
      }),
    );
  }

  // static createjwtToken(authdata: Logindatainterface): Observable<any> {
  //   const token = jwt.sign(authdata)
  // }
}
