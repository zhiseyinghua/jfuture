import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { AUTH_CONFIG } from './auth.config';
import { Logindatainterface } from './auth.interface';
import uuid = require('uuid');
import {
  DbElasticinterfacePutReturn,
  dbinterface,
  Queryinterface,
} from 'src/common/db.elasticinterface';
import { map, switchMap } from 'rxjs/operators';
import { autherrorCode } from './auth.code';
var jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  public static logger = 'AuthService';
  /**
   * 根据uuid查询es里的user字段,返回es里auth里所有的字段
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
          'phone.keyword': phone,
        },
      },
    };
    return DbElasticService.executeInEs(
      'get',
      AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.SEARCH,
      querydata,
    ).pipe(
      map((result: Queryinterface) => {
        if (
          result.hits.total.value == 1 &&
          result.hits.hits[0]._source['range']
        ) {
          return result.hits.hits[0]._source;
        } else if (result.hits.total.value > 1) {
          return autherrorCode.user_error;
        } else if (result.hits.total.value == 0) {
          return false;
        }
      }),
    );
  }

  /**
   * 将用户注册信息存储到数据库,注册成功返回true,否则抛出一个error
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
      role:'menber'
    };
    // console.log(this.logger + 'storageUserlogindata data', data);
    // console.log(this.logger, 'storageUserlogindata eldata', eldata);

    return DbElasticService.executeInEs(
      'put',
      AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.DOC + '/' + eldata.range,
      eldata,
    ).pipe(
      // 查询
      map((result: DbElasticinterfacePutReturn) => {
        if (result.result == 'created' && result._shards.successful == 1) {
          return true;
        } else {
          return throwError(new Error(autherrorCode.database_storage_failed));
        }
      }),
    );
  }

  public static createjwtToken(): Observable<any> {
    const user = {
      jti: 1,
      iss: 'gumt.top',
      user: 'goolge',
    };

    return
    var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
    // return older_token

  }
}
