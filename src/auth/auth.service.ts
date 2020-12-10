import { Injectable } from '@nestjs/common';
import { Observable, of, range, throwError } from 'rxjs';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { AUTH_CONFIG } from './auth.config';
import {
  AuthuserIdtokenInterface,
  AuthuserInterface,
  BackidtokenInterface,
  CreateIdtokenInterface,
  idToken,
  Logindatainterface,
} from './auth.interface';
import uuid = require('uuid');
import {
  DbElasticinterfacePutReturn,
  Dbinterface,
  Queryinterface,
} from 'src/common/db.elasticinterface';
import { map, switchMap } from 'rxjs/operators';
import { AutherrorCode } from './auth.code';
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
          return AutherrorCode.user_error;
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
          return throwError(new Error(AutherrorCode.database_storage_failed));
        }
      }),
    );
  }

  /**
   * 创建一个idtoken
   * @param authdata
   */
  public static createjwtToken(
    authdata: CreateIdtokenInterface,
  ): Observable<any> {
    let time = Date.now();
    const idtoken: AuthuserIdtokenInterface = {
      ...authdata,
      iat: time,
      iss: 'future_time',
      sub: 'member',
      platform:authdata.platform,
      device:authdata.device
    };
    return AuthService.upjwttokenkey({
      hash: authdata.hash,
      range: authdata.range,
      index: authdata.index,
    }).pipe(
      map((data) => {
        let idtokenbackdata: BackidtokenInterface = {
          status: 'success',
          idtoken: jwt.sign(idtoken, data, { expiresIn: 3600000 * 24 }),
        };
        return idtokenbackdata;
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
   * 验证一个idtoken是否有效，有效返回token解析后的信息，无效抛出一个错误
   * @param token
   */
  static verifyIdtoken(token: string) {
    var decoded = jwt.decode(token) as idToken;
    return AuthService.getEsdbAuth({
      hash: decoded.hash,
      range: decoded.range,
      index: decoded.index,
    }).pipe(
      map((result) => {
        // return result['webbase64key']
        console.log();
        return jwt.verify(token, result['webbase64key']);
      }),
    );
  }

  /**
   * 根据一个快过期的token得到一个新的token
   * @param token
   */
  static byTokenGetToken(token: string,platform:string,device:string) {
    return AuthService.verifyIdtoken(token).pipe(
      switchMap((result: idToken) => {
        return AuthService.getEsdbAuth({
          hash: result.hash,
          range: result.range,
          index: result.index,
        });
      }),
      switchMap((result) => {
        let createIdtoken: CreateIdtokenInterface = {
          hash: result.hash,
          range: result.range,
          index: result.index,
          role: result.role,
          phone: result.phone,
          timestamp: result.timestamp,
          realname: result.realname,
          platform:platform,
          device:device
        };
        return AuthService.createjwtToken(createIdtoken);
      }),
    );
  }

  /**
   * 解码token
   * @param token
   */
  static decodeIdtoken(token: string) {
    return jwt.decode(token) as idToken;
  }

  /**
   * 这是一个改变密码的方法,成功后返回auth 的所有数据
   * @param phone 电话号码
   * @param possword 密码
   */
  static resetpossword(phone: string, possword: string) {
    let authadata;
    console.log('111111111111111111111111111',authadata)
    return AuthService.byphoneNumber(phone).pipe(
      switchMap((byphoneResult) => {
        if (byphoneResult && byphoneResult.range) {
          authadata = byphoneResult
          return DbElasticService.executeInEs(
            'post',
            AUTH_CONFIG.INDEX +
              '/' +
              AUTH_CONFIG.DOC +
              '/' +
              byphoneResult.range +
              '/' +
              AUTH_CONFIG.UPDATA,
            {
              doc: {
                encodepossword: possword,
              },
            },
          );
        } else {
          return throwError(new Error(AutherrorCode.The_user_does_not_exist))
        }
      }),
      map(()=>{
        return authadata
      })
    );
  }
}
