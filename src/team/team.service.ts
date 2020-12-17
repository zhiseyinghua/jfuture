import { Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbElasticinterfacePutReturn } from 'src/common/db.elasticinterface';
import { DbElasticService } from 'src/service/es.service';
import { TEAM_CONFIG } from './team.config';
import { TeamInfoInterface } from './team.interface';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');

@Injectable()
export class TeamService {
    public static logger = 'TeamService';
    public static InsertTeamInfo(data:TeamInfoInterface): Observable<any> {
        console.log(this.logger + 'insertteamdata data', data);
        return DbElasticService.executeInEs(
          'put',
         TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.DOC + '/' + data.range,
          data,
        ).pipe(
          map((result: DbElasticinterfacePutReturn) => {
            if (result.result == 'created' && result._shards.successful == 1) {
              return data;
            } else {
              return throwError(new Error(TeamErrorCode.insert_error));
            }
          }),
        );
    }








}
