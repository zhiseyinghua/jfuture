import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { AUTH_CONFIG } from './auth.config';
import { logindatainterface } from './auth.interface';
import uuid = require('uuid');
import { DbElasticinterfacePutReturn, dbinterface } from 'src/common/db.elasticinterface';
import { switchMap } from 'rxjs/operators';

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
   * 将用户注册信息存储到数据库
   * @param data
   */
  static storageUserregisterdata(data: logindatainterface): Observable<any> {
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
       AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.DOC + '/' + eldata.range,
      eldata,
    ).pipe(
      switchMap( (result: DbElasticinterfacePutReturn)=>{
        if(result.found == true)
      })
    )
  }
}
