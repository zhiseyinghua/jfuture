import { Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbElasticinterfacePutReturn } from 'src/common/db.elasticinterface';
import { DbElasticService } from 'src/service/es.service';
import { TEAM_CONFIG } from './team.config';
import { TeamInfoInterface } from './team.interface';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');
import { DynamoDBService } from 'src/service/dynamodb.serves';

@Injectable()
export class TeamService {
    public static logger = 'TeamService';
    public static InsertTeamInfo(data:TeamInfoInterface): Observable<any> {
      let eldata: TeamInfoInterface = {
        hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
        range: uuid.v4(),
        index: 'team',
        teamname:data.teamname,
        projectname:data.projectname,
        projectprogress:data.projectname,
        membername:data.membername,
      };
      return DbElasticService.executeInEs(
        'put',
        TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.DOC + '/' + eldata.range,
        eldata,
      ).pipe(
        map((result: DbElasticinterfacePutReturn) => {
          if (result.result == 'updated' && result._shards.successful == 1) {
            return eldata;
          } else {
            return throwError(new Error(TeamErrorCode.insert_error));
          }
        }),
      );
}
}
