import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn, Queryinterface } from 'src/common/db.elasticinterface';
import { DbElasticService } from 'src/service/es.service';
import { TEAM_CONFIG } from './team.config';
import { TeamInfo, Teaminfo, TeamInfoInterface, TeamMember, Teamminterface } from './team.interface';
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
  /**
   * 
   * @param data 插入团队信息
   */
  public static insertteaminfo(data: TeamInfoInterface): Observable<any> {
    let eldata: TeamInfoInterface = {
      hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
      range: uuid.v4(),
      index: TEAM_CONFIG.INDEX,
      teamid: data.teamid,
      teamname: data.teamname,
      projectid: data.projectid,
      projectname: data.projectname,
      projectprogress: data.projectprogress,
      description: data.description,
      type: data.type,
      teamMemberKey: data.teamMemberKey
    };
    return DbElasticService.executeInEs(
      'put',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.DOC + '/' + eldata.range,
      eldata,
    )
      .pipe(
        switchMap((result: DbElasticinterPutReturn) => {
          if (result.result == 'created' && result._shards.successful == 1) {
            return of(eldata);
          } else {
            return throwError(new Error('insert_teaminfo_error'));
          }
        }),
      );
  }
  /**
   * 
   * @param TeamIndex 根据团队信息的range查找
   */
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
      switchMap((data: Queryinterface) => {
        if (data.hits.total.value == 1 &&
          data.hits.hits[0]._source['range']) {
          return of(data.hits.hits[0]._source)
        }
        else {
          return throwError(new Error('team_not_found'));
        }
      })
    )
  }

  public static SearchTeam(TeamIndex: Teaminfo): Observable<any> {
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
    )
      .pipe(
        switchMap((data: Queryinterface) => {
          if (data.hits.total.value == 1 &&
            data.hits.hits[0]._source['range']) {
            return of(data.hits.hits[0]._source)
          }
          else {
            return throwError(new Error('search_teaminfo_error'));
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
    return DbElasticService.executeInEs(
      'post',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.DOC + '/' + TeamInfo.range + '/' + TEAM_CONFIG.UPDATA,
      {
        "doc": {
          teamid: data.teamid,
          teamname: data.teamname,
          projectid: data.projectid,
          projectname: data.projectname,
          projectprogress: data.projectprogress,
          description: data.description,
          type: data.type,
        },
      }).pipe(
        switchMap((result: DbElasticinterPutReturn) => {
          if (result.result == 'updated' && result._shards.successful == 1) {
            return of(data);
          }
          if (result._shards.failed == 0) {
            return throwError(new Error('teaminfo_not_change'));
          }
          else {
            return throwError(new Error('update_teaminfo_error'));
          }
        }
        ),
      )
  }



  public static DeleteTeamInfo(data: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'delete',
      TEAM_CONFIG.INDEX + '/',
      {
        "query": {
          "match": {
            "range": "data.range"
          }
        }
      }
    )
  }

  public static SearchMemberByAuth(TeamIndex: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAM_CONFIG.INDEX + '/' + TEAM_CONFIG.SEARCH,
      {
        query: {
          term: {
            'AuthKey.range.keyword': TeamIndex.range
          }
        }
      }
    )
      .pipe(
        switchMap((data: Queryinterface) => {
          if (
            data.hits.total.value >= 1 && data.hits.hits[0]._source['range']) {
            return of(data)
          }
          if (data.hits.total.value == 0) {
            return throwError(new Error('search_team_error'));
          }
          else {
            return throwError(new Error('search_team_error'));
          }
        })
      )
  }

}



