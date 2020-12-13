import { Injectable } from '@nestjs/common';
import { UserInfoInterface} from'./user.interface';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { Observable } from 'rxjs';
import uuid = require('uuid');
import { USER_CONFIG } from './user.config';
import { UserController } from './user.controller';
import { Dbinterface } from 'src/common/db.elasticinterface';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class UserService {
  static getEsdbAuth(arg0: { hash: any; range: any; index: any; }) {
    throw new Error('Method not implemented.');
  }
    public static logger = 'UserService';
    static storeUserInfo(data: UserInfoInterface): Observable<any> {
        console.log(this.logger + 'storeUserinfo data', data);
        return DbElasticService.executeInEs(
          'put',
          USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + data.range,
           data,
        )
    }

     public static  UpdateUserInfo(data: UserInfoInterface): Observable<any> {
        console.log(this.logger + 'updateUserinfo data', data);
        console.log(this.logger, 'updateUserinformation eldata', data);
        return DbElasticService.executeInEs(
          'post',
           USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + data.range,
           data,
        ) 
    }

      public static SearchUserInfo(userid: string): Observable<any> {
        return DbElasticService.executeInEs(
          'get',
          USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' +userid                    ,
          '',)
}
  }

  
