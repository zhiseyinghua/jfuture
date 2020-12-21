import { Injectable } from '@nestjs/common';
import { UserInfo, UserInfoInterface } from './user.interface';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { Observable, throwError } from 'rxjs';
import uuid = require('uuid');
import { USER_CONFIG } from './user.config';
import { UserController } from './user.controller';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn, Dbinterface, Queryface, Queryinterface } from 'src/common/db.elasticinterface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UsererrorCode } from './UsererrorCode';
import { AUTH_CONFIG } from 'src/auth/auth.config';

@Injectable()
export class UserService {
  static getEsdbAuth(arg0: { hash: any; range: any; index: any; }) {
    throw new Error('Method not implemented.');
  }
  public static logger = 'UserService';
  static storeUserInfo(data: UserInfoInterface): Observable<any> {
    return DbElasticService.executeInEs(
      'put',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + data.range,
      data,
    )
      .pipe(
        map((result: DbElasticinterPutReturn) => {
          if (result.result == 'created' && result._shards.successful == 1) {
            return data;
          } else {
            return throwError(new Error(UsererrorCode.insert_error));
          }
        }),
      );
  }

  static UpdateUserInfo(resultdata: UserInfoInterface): Observable<any> {
    let userInfo = {
      hash: resultdata.hash,
      range: resultdata.range,
      index: resultdata.index,
    }
    return this.ByAuthkey(userInfo).pipe(
      switchMap((data) => {
        if (userInfo.range == data.authKey.range) {
          return DbElasticService.executeInEs(
            'post',
            USER_CONFIG.INDEX + '/' + USER_CONFIG.UPDATA + '/' + data.range,
            {
              "doc": {
                userid: '',
                usernickname: '',
                telephone: '',
                usermail: '',
                userico: '',
                userpassword: '',
              },
            })
        }
        else {
          return this.storeUserInfo(resultdata)
        }
      }),
      map((result: DbElasticinterPutReturn) => {
        if (result.result == 'updated' && result._shards.successful == 1) {
          ``
          return resultdata;
        } else {
          return throwError(new Error(UsererrorCode.insert_error));
        }
      }
      ),
    )
  }
  static ByAuthkey(authKey: any): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.SEARCH,
      {
        "query": {
          "term": {
            "authKey.range.keyword": authKey.range
          }
        }
      }
    ).pipe(
      map((result: Queryface) => {
        if (
          result.data.hits.total.value == 1 &&
          result.data.hits.hits[0]._source['range']
        ) {
          return result.data.hits.hits[0]._source;
        } else if (result.data.hits.total.value > 1) {
          return UsererrorCode.update_error;
        } else if (result.data.hits.total.value == 0) {
          return false;
        }
      }),
    );
  }
  // public static DeleteUserInfo(data: UserInfoInterface): Observable<any> {
  //   return DbElasticService.executeInEs(
  //     'put',
  //     USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + data.authKey.range,
  //     data,
  //   )
  //     .pipe(
  //       map((result: DbElasticinterPutReturn) => {
  //         if (result.result == 'updated' && result._shards.successful == 1) {
  //           return data;
  //         } else {
  //           return throwError(new Error(UsererrorCode.delete_error));
  //         }
  //       }),
  //     );
  // }
  public static SearchUserInfo(userid: string): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + userid,
      '')
  }
}