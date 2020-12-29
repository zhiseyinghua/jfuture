import { Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn, Queryinterface } from 'src/common/db.elasticinterface';
import { DbElasticService } from 'src/service/es.service';
import { TEAM_CONFIG } from './team.config';
import { Teaminfo, TeamInfo, TeamInfoInterface, TeamMember } from './team.interface';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { Errorcode } from 'src/common/error.code';

@Injectable()
export class TeamService {
  static getEsdbTeam(arg0: { hash: any; range: any; index: any; }) {
    throw new Error('Method not implemented.');
  }
  public static logger = 'TeamService';
  public static insertteaminfo(data: TeamInfoInterface): Observable<any> {
    let eldata: TeamInfoInterface = {
      hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
      range: uuid.v4(),
      index: TEAM_CONFIG.INDEX,
      teamname: data.teamname,
      projectname: data.projectname,
      projectprogress: data.projectprogress,
      // membername: data.membername,
      teamMemberKey: data.teamMemberKey
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
            return throwError(new Error(Errorcode.insert_teaminfo_error));
          }
        }),
      );
  }c

  public static SearchTeamInfo(TeamIndex: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.SEARCH,
      {
        query: {
          term: {
            'range.keyword': TeamIndex.range
          }
        }
      }
    ).pipe(
      map((data: Queryinterface) => {
        if (data.hits.total.value == 1 &&
          data.hits.hits[0]._source['range']) {
          return data.hits.hits[0]._source
        }
       else {
          return Errorcode.search_team_error
        }
      })
    )
  }

  
  public static SearchMemberByTK(TeamIndex: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.SEARCH,
      {
        query: {
          term: {
            'TeamKey.range.keyword': TeamIndex.range
          }
        }
      }
    )
    .pipe(
      map((data: Queryinterface) => {
        if (data.hits.total.value == 1&&
          data.hits.hits[0]._source['range']) {
          return data.hits.hits[0]._source
        }
       else {
          return Errorcode.search_team_error
        }
      })
    )
  }
  public static SearchMemberByTMK(TeamIndex: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.SEARCH,
      {
        query: {
          term: {
            'teamMemberKey.range.keyword': TeamIndex.range
          }
        }
      }
    )
    .pipe(
      map((data: Queryinterface) => {
        if (data.hits.total.value == 1&&
          data.hits.hits[0]._source['range']) {
          return data.hits.hits[0]._source
        }
       else {
          return Errorcode.search_team_error
        }
      })
    )
  }
  public static UpdateTeamInfo(data: TeamInfoInterface): Observable<any> {
    let TeamInfo = {
      hash: data.hash,
      range: data.range,
      index: data.index,
    }
    console.log(TeamInfo)
    console.log()
    return DbElasticService.executeInEs(
      'post',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.DOC + '/' + TeamInfo.range + '/' + TEAM_CONFIG.UPDATA,
      {
        "doc": {
          teamname: data.teamname,
          projectname: data.projectname,
          projectprogress: data.projectprogress,
          // membername: data.membername,
        },
      }).pipe(  
        map((result: DbElasticinterPutReturn) => {
          if (result.result == 'updated' && result._shards.successful == 1) {
            return data;
          }
          if (result._shards.failed == 0) {
            return Errorcode.teaminfo_not_change;
          }
          else {
            return throwError(new Error(Errorcode.update_teaminfo_error));
          }
        }
        ),
      )
  }
  public static inteammemberinfo(data: TeamMember): Observable<any> {

    let eldata: TeamMember = {
      hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
      range: uuid.v4(),
      index: TEAM_CONFIG.INDEX,
      TeamMemberName: data.TeamMemberName,
      position:data.position,
      role: data.role,
      TeamKey: data.TeamKey,
      AuthKey: data.AuthKey,
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
            return throwError(new Error(Errorcode.insert_teaminfo_error));
          }
        }),
      );
  }
}


