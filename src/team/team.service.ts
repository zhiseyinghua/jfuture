import { Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn } from 'src/common/db.elasticinterface';
import { DbElasticService } from 'src/service/es.service';
import { TEAM_CONFIG } from './team.config';
import { TeamInfo, TeamInfoInterface } from './team.interface';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');
import { DynamoDBService } from 'src/service/dynamodb.serves';

@Injectable()
export class TeamService {
  static getEsdbTeam(arg0: { hash: any; range: any; index: any; }) {
    throw new Error('Method not implemented.');
  }
  public static logger = 'TeamService';
  public static insertteaminfo(data: TeamInfoInterface): Observable<any> {
    console.log('UserService storeUserInfo data', data)
    let eldata: TeamInfoInterface = {
      hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
      range: uuid.v4(),
      index: TEAM_CONFIG.INDEX,
      teamname: data.teamname,
      projectname: data.projectname,
      projectprogress: data.projectprogress,
      membername: data.membername,
    };
    return DbElasticService.executeInEs(
      'put',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.DOC + '/' + eldata.range,
      eldata,
    )
      .pipe(
        map((result: DbElasticinterPutReturn) => {
          if (result.result == 'created' && result._shards.successful == 1) {
            return eldata;
          } else {
            return throwError(new Error(TeamErrorCode.insert_teaminfo_error));
          }
        }),
      );
  }

  public static SearchTeamInfo(TeamIndex: TeamInfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.SEARCH,
      {
        "query": {
          "bool": {
            "must": [
              { "match": { "hash":  TeamIndex.hash }},
              { "match": { "range": TeamIndex.range}},
              { "match": { "index": TeamIndex.index}},
            ]
          }
        }
      }
    )
  }

  public static UpdateTeamInfo(data:TeamInfoInterface):Observable<any>{
   return


  }
}
