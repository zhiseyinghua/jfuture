import { Injectable } from '@nestjs/common';
import { UserInfoInterface } from './user.interface';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { from, Observable } from 'rxjs';
import uuid = require('uuid');
import { AUTH_CONFIG } from 'src/auth//auth.config';
import { map, switchMap } from 'rxjs/operators';
import { DbElasticinterfacePutReturn } from 'src/common/db.elasticinterface';
import { USER_CONFIG } from './user.config';

@Injectable()
export class UserService {
  public static logger = 'UserService';
  public static storeUserInfo(data: UserInfoInterface): Observable<any> {
    console.log(this.logger + 'storeUserinfo data', data);
    let eldata: UserInfoInterface = {
      hash: DynamoDBService.computeHash(USER_CONFIG.INDEX),
      range: uuid.v4(),
      index: 'user',
      userid: '4',
      usernickname: '',
      telephone: '',
      usermail: '',
      userico: '',
      authKey: {
        hash: '123',
        range: '456',
        index: '789',
      }
    };
    console.log(this.logger, 'storeUserinformation eldata', eldata);
    return DbElasticService.executeInEs(
      'put',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + eldata.range,
      eldata,
    )
  }
  public static UpdateUserInfo(data: UserInfoInterface): Observable<any> {
    console.log(this.logger + 'updateUserinfo data', data);
    let eldata: UserInfoInterface = {
      hash: DynamoDBService.computeHash(USER_CONFIG.INDEX),
      range: uuid.v4(),
      index: 'user',
      userid: '4',
      usernickname: '',
      telephone: '',
      usermail: '123',
      userico: '213',
      authKey: {
        hash: "123",
        range: "243",
        index: "2432",
      }
    };
    console.log(this.logger + 'updateUserinfo data', data);
    console.log(this.logger, 'updateUserinformation eldata', eldata);
    return DbElasticService.executeInEs(
      'post',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.DOC + '/' + eldata.range,
      eldata,
    );
  }
  public static SearchUserInfo(userid: string): Observable<any> {
    let querydata = {
      'query': {
        'term': {
          'userid.keyword': userid,
        },
      },
    };
    return DbElasticService.executeInEs(
      'get',
      USER_CONFIG.INDEX + '/' + USER_CONFIG.SEARCH,
      querydata)
  }
}