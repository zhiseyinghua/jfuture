import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { AUTH_CONFIG } from './auth.config';
import {
  AuthuserIdtokenInterface,
  AuthuserInterface,
  Logindatainterface,
} from './auth.interface';
import uuid = require('uuid');
import {
  DbElasticinterfacePutReturn,
  Dbinterface,
  Queryinterface,
} from 'src/common/db.elasticinterface';
import { map, switchMap } from 'rxjs/operators';
import { autherrorCode } from './auth.code';
import { Base64 } from 'js-base64';

var jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  public static logger = 'AuthService';
  /**
   * 根据uuid查询es里的user字段,返回es里auth里所有的字段
   * @param user
   */
  public static getEsdbAuth(userRange: Dbinterface): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.DOC + '/' + userRange.range,
    ).pipe(
      map((result) => {
        return result['_source'];
      }),
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
   * 将用户注册信息存储到数据库,注册成功返回用户数据,否则抛出一个error
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
      role: 'menber',
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
          return eldata;
        } else {
          return throwError(new Error(autherrorCode.database_storage_failed));
        }
      }),
    );
  }

  /**
   * 创建一个idtoken
   * @param authdata
   */
  public static createjwtToken(authdata: AuthuserInterface): Observable<any> {
    let time = Date.now();
    const idtoken: AuthuserIdtokenInterface = {
      ...authdata,
      iat: time,
      iss: 'future_time',
      sub: 'member',
    };
    return AuthService.upjwttokenkey({
      hash: authdata.hash,
      range: authdata.range,
      index: authdata.index,
    }).pipe(
      map((data) => {
        return jwt.sign(idtoken, data, { expiresIn: 3600000 * 24 });
      }),
    );
  }

  /**
   * 生成一个base64位的用于签名的字符串，上传至数据库，成功则返回这个字符串
   * @param key
   */
  static upjwttokenkey(key: Dbinterface): Observable<any> {
    let authtokenData =
      'Basic' + Base64.encode('future time' + new Date().getTime() + key.range);
    let esbody = {
      doc: {
        webbase64key: authtokenData,
      },
    };
    return DbElasticService.executeInEs(
      'POST',
      AUTH_CONFIG.INDEX +
        '/' +
        AUTH_CONFIG.DOC +
        '/' +
        key.range +
        '/' +
        AUTH_CONFIG.UPDATA,
      esbody,
    ).pipe(
      map(() => {
        return authtokenData;
      }),
    );
  }

  /**
   * 
   * @param token 
   */
  static verifyIdtoken(token: string){
    var decoded = jwt.decode(token)
    return decoded
  }
}
