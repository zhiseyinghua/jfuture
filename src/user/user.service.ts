import { Injectable } from '@nestjs/common';
import { UserInfoInterface} from'./user.interface';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { Observable, throwError } from 'rxjs';
import uuid = require('uuid');
import { USER_CONFIG } from './user.config';
import { UserController } from './user.controller';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn, Dbinterface } from 'src/common/db.elasticinterface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UsererrorCode } from './UsererrorCode';

@Injectable()
export class UserService {
  static getEsdbAuth(arg0: { hash: any; range: any; index: any; }) {
    throw new Error('Method not implemented.');
  }
    public static logger = 'UserService';
    static storeUserInfo(data: UserInfoInterface): Observable<any> {
        // console.log(this.logger + 'storeUserinfo data', data);
        return DbElasticService.executeInEs(
          'put',
           USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + data.authKey.range,
           data,
        ).pipe(
          map((result:  DbElasticinterPutReturn ) => {
            if (result.result == 'updated' && result._shards.successful == 1) {
              return data;
            } else {
              return throwError(new Error(UsererrorCode.insert_error));
            }
          }),
        );
    }

     public static  UpdateUserInfo(data: UserInfoInterface): Observable<any> {
        return DbElasticService.executeInEs(
          'post',
           USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + data.authKey.range,
           data,
        )
         .pipe(
          map((result:  DbElasticinterPutReturn ) => {
            if (result.result == 'updated' && result._shards.successful == 1) {
              return data;
            } else {
              return throwError(new Error(UsererrorCode.update_error));
            }
          }),
        );
    }
    public static  DeleteUserInfo(data: UserInfoInterface): Observable<any> {
      return DbElasticService.executeInEs(
        'delete',
         USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + data.authKey.range,
         data,
      )
       .pipe(
        map((result:  DbElasticinterPutReturn ) => {
          if (result.result == 'deleted' && result._shards.successful == 1) {
            return data;
          } else {
            return throwError(new Error(UsererrorCode.delete_error));
          }
        }),
      );
  }
      public static SearchUserInfo(userid: string): Observable<any> {
        return DbElasticService.executeInEs(
          'get',
          USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' +userid                    ,
          '', )
}
}

  
