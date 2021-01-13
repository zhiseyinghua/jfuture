import { Injectable } from '@nestjs/common';
import { UserInfo, UserInfoInterface } from './user.interface';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { Observable, of, throwError } from 'rxjs';
import uuid = require('uuid');
import { USER_CONFIG } from './user.config';
import { UserController } from './user.controller';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn, Dbinterface, Queryface, Queryinterface } from 'src/common/db.elasticinterface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UsererrorCode } from './UsererrorCode';
import { AUTH_CONFIG } from 'src/auth/auth.config';
import { AutherrorCode } from 'src/auth/auth.code';
import { Errorcode } from 'src/common/error.code';

@Injectable()
export class UserService {

  public static logger = 'UserService';
  static storeUserInfo(data: UserInfoInterface): Observable<any> {
    console.log('UserService storeUserInfo data', data)
    let eldata: UserInfoInterface = {
      hash: DynamoDBService.computeHash(AUTH_CONFIG.INDEX),
      range: uuid.v4(),
      index: AUTH_CONFIG.INDEX,
      usernickname: data.usernickname,
      telephone: data.telephone,
      usermail: data.usermail,
      userico: data.userico,
      position: data.position,
      startdate: data.startdate,
      companyname: data.companyname,
      authKey: data.authKey,
    };
    return DbElasticService.executeInEs(
      'put',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + eldata.range,
      eldata,
    )
      .pipe(
        switchMap((result: DbElasticinterPutReturn) => {
          if (result.result == 'created' && result._shards.successful == 1) {
            return of(eldata);
          } else {
            return throwError(new Error('insert_error'));

          }
        }),
      );
  }

  static UpdateUserInfo(resultdata: UserInfoInterface): Observable<any> {
    console.log('UserService UpdateUserInfo resultdata', resultdata)
    let userInfo = {
      hash: resultdata.hash,
      range: resultdata.range,
      index: resultdata.index,
    }

    return DbElasticService.executeInEs(
      'post',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + userInfo.range + '/' + USER_CONFIG.UPDATA,
      {
        "doc": {
          usernickname: resultdata.usernickname,
          telephone: resultdata.telephone,
          usermail: resultdata.usermail,
          userico: resultdata.userico,
          position: resultdata.position,
          startdate: resultdata.startdate,
          companyname: resultdata.companyname,
        },
      }).pipe(
        switchMap((result: DbElasticinterPutReturn) => {
          if (result.result == 'updated' && result._shards.successful == 1) {
            return of(resultdata);
          }
          if (result._shards.failed == 0) {
            return throwError(new Error('userinfo_not_change'));
          }
          else {
            return throwError(new Error('update_error'));
          }
        }
        ),
      )
  }


  /**
   * 
   * @param authKey 用户的key
   */
  static ByAuthkey(newauthKey: any): Observable<any> {

    return DbElasticService.executeInEs(
      'get',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.SEARCH,
      {
        query: {
          term: {
            'authKey.range.keyword': newauthKey.range
          }
        }
      }
    ).pipe(
      map((result: any) => {
        if (
          result.hits.total.value == 1 &&
          result.hits.hits[0]._source['range']
        ) {
          return result.hits.hits[0]._source;
        } else if (result.hits.total.value > 1) {
          return AutherrorCode.user_error;
        } else if (result.hits.total.value == 0) {
          return false;
        } else {
          // TODO:
          // console.log("")
        }
      }),
    );
  }


  public static SearchUserInfo(data: UserInfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.SEARCH,
      {
        query: {
          term: {
            'range.keyword': data.range
          }
        }
      }
    )
      .pipe(
        switchMap((data: Queryinterface) => {
          if (data.hits.total.value == 1 &&
            data.hits.hits[0]._source['range']) {
            return of(data.hits.hits[0]._source)
          }
          else {
            return throwError(new Error('search_error'))
          }
        })
      )
  }
  public static SearchByAuthKey(data: UserInfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.SEARCH,
      {
        query: {
          term: {
            'authKey.range.keyword': data.range
          }
        }
      }
    ).pipe(
      switchMap((data: Queryinterface) => {
        console.log(data)
        if (data.hits.total.value == 1 &&
          data.hits.hits[0]._source['range']) {
          return of(data.hits.hits[0]._source)
        }
        else {
          return throwError(new Error('search_error'))
        }
      })
    )
  }

}


