import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { FIGURE_CONFIG } from './figure.config';
import uuid = require('uuid');
import { PutOrderOne } from './figure.interface';

@Injectable()
export class FigureService {
  public static logger = 'AuthService';
  // TODO: 
  public static putOrder(data: PutOrderOne) {
    let createIdtoken:PutOrderOne = {
      hash: DynamoDBService.computeHash(FIGURE_CONFIG.INDEX),
      range: uuid.v4(),
      index: FIGURE_CONFIG.INDEX,
      localPlace: null,
      type: data.type,
      estimatedTime: 123465789,
      area: null,
      creatorkey: data.creatorkey,
      technician: data.technician,
      // 甲方信息
      ONEinformation: data.ONEinformation
    };
    return DbElasticService.executeInEs(
      'PUT',
      FIGURE_CONFIG.INDEX + '/' + FIGURE_CONFIG.DOC + '/' + '1',
      createIdtoken
    ).pipe(
      map((result) => {
        return result['_soutce'];
      }),
    );
  }

  //   public static getEsdbAuth(userRange: Dbinterface): Observable<any> {
  //     return DbElasticService.executeInEs(
  //       'get',
  //       AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.DOC + '/' + userRange.range,
  //     ).pipe(
  //       map((result) => {
  //         return result['_source'];
  //       }),
  //     );
  //   }
}
