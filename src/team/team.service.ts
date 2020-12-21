import { Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn } from 'src/common/db.elasticinterface';
import { DbElasticService } from 'src/service/es.service';
import { TEAM_CONFIG } from './team.config';
import { TeamInfoInterface } from './team.interface';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');
import { DynamoDBService } from 'src/service/dynamodb.serves';

@Injectable()
export class TeamService {
  static getEsdbTeam(arg0: { hash: any; range: any; index: any; }) {
    throw new Error('Method not implemented.');
  }
    public static logger = 'TeamService';
    public static insertteaminfo(data:TeamInfoInterface): Observable<any> {
      return DbElasticService.executeInEs(
        'put',
        TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.DOC + '/' + data.range,
        data,
      )
        .pipe(
          map((result: DbElasticinterPutReturn) => {
            if (result.result == 'created' && result._shards.successful == 1) {
              return data;
            } else {
              return throwError(new Error(TeamErrorCode.insert_error));
            }
          }),
        );
    }
}

