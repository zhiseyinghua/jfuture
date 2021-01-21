
import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DbElasticinterfacePutReturn, DbElasticinterPutReturn, DELETE, Queryinterface } from 'src/common/db.elasticinterface';
import { DbElasticService } from 'src/service/es.service';
import uuid = require('uuid');
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { Errorcode } from 'src/common/error.code';
import { TeamInfo, Teaminfo, TeamInfoInterface, TeamMember, Teamminterface } from './teammember.interface';
import { TEAM_CONFIG } from 'src/team/team.config';
import { TEAMMEMBER_CONFIG } from './team.config';


@Injectable()
export class TeammemberService {
  static getEsdbTeam(arg0: { hash: any; range: any; index: any; }) {
    throw new Error('Method not implemented.');
  }
  public static logger = 'TeamService';
  /**
   * 
   * @param data 插入团队信息
   */

  /**
   * 
   * @param TeamIndex 根据团队信息的range查找团队信息，若查询不到，返回team_not_found
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
  /**
   * 
   * @param TeamIndex 根据团队成员信息的range查找团队信息，若查询不到，返回teammember_not_found
   */
  public static SearchTeamMember(TeamIndex: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAMMEMBER_CONFIG.INDEX + '/' + TEAMMEMBER_CONFIG.SEARCH,
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
          // return of(data)
          if (data.hits.total.value == 1 &&
            data.hits.hits[0]._source['range']) {
            return of(data.hits.hits[0]._source)
          }
          else {
            return throwError(new Error('teammember_not_found'));
          }
        })
      )

  }
  /**
   * 
   * @param TeamIndex 根据团队成员的TeamKey查找团队信息，若查询不到，返回search_teaminfo_error
   */
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
  /**
   * 
   * @param TeamIndex 根据团队成员的TeamKey查找团队成员信息，若查询不到，返回search_teammember_error
   */
  public static SearchMemberReturn(TeamIndex: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAMMEMBER_CONFIG.INDEX + '/' + TEAMMEMBER_CONFIG.SEARCH,
      {
        query: {
          term: {
            'TeamKey.range.keyword': TeamIndex.range
          }
        }
      }
    )
      .pipe(
        switchMap((data: Queryinterface) => {
          console.log(data)
          if (
            data.hits.total.value >= 1 && data.hits.hits[0]._source['range']) {
            return of(data.hits.hits)
          }
          if (data.hits.total.value == 0) {
            return throwError(new Error('search_teammember_error'));
          }
          else {
            return throwError(new Error('search_teammember_error'));
          }
        })
      )
  }
  /**
   * 
   * @param data 更新团队成员信息
   */
  public static UpdateMemberInfo(data: TeamMember): Observable<any> {
    let TeamInfo = {
      hash: data.hash,
      range: data.range,
      index: data.index,
    }
    console.log(TeamInfo)
    return DbElasticService.executeInEs(
      'post',
      TEAMMEMBER_CONFIG.INDEX + '/' + TEAMMEMBER_CONFIG.DOC + '/' + TeamInfo.range + '/' + TEAMMEMBER_CONFIG.UPDATA,
      {
        "doc": {
          TeamMemberName: data.TeamMemberName,
          gender: data.gender,
          age: data.age,
          position: data.position,
          img: data.img,
          description: data.description,
          birth: data.birth,
          role: data.role,
        },
      }).pipe(
        switchMap((result: DbElasticinterPutReturn) => {
          if (result.result == 'updated' && result._shards.successful == 1) {
            return of(data);
          }
          if (result._shards.failed == 0) {
            return throwError(new Error('teammember_info_not_change'));
          }
          else {
            return throwError(new Error('update_teammember_info_error'));
          }
        }
        ),
      )
  }
  /**
   * 
   * @param data 插入团队成员信息
   */
  public static inteammemberinfo(data: Teamminterface): Observable<any> {

    let eldata: Teamminterface = {
      hash: DynamoDBService.computeHash(TEAMMEMBER_CONFIG.INDEX),
      range: uuid.v4(),
      index: TEAMMEMBER_CONFIG.INDEX,
      role: 'menber',
      TeamKey: data.TeamKey,
      AuthKey: data.AuthKey,
    };
    return DbElasticService.executeInEs(
      'put',
      TEAMMEMBER_CONFIG.INDEX + '/' + TEAMMEMBER_CONFIG.DOC + '/' + eldata.range,
      eldata,
    ).pipe(
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
   * @param data 删除团队成员信息
   */
  public static DeleteTeamMember(data: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'post',
      TEAMMEMBER_CONFIG.INDEX + '/' + '_delete_by_query',
      {
        "query": {
          "match": {
            "range": data.range
          }
        }
      }
    )
      .pipe(
        switchMap((result: DELETE) => {
          if (result.deleted == 1) {
            return of(data);
          }
        }
        ),
      )
  }
  /**
   * 
   * @param data 根据团队信息的hash,range,index删除团队成员
   */
  public static DeleteTeamMemberByTeamKey(data: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'post',
      TEAMMEMBER_CONFIG.INDEX + '/' + '_delete_by_query',
      {
        "query": {
          "match": {
            "TeamKey.range": data.range
          }
        }
      }
    )
      .pipe(
        switchMap((result: DELETE) => {
          if (result.deleted == 1) {
            return of(data);
          }
        }
        ),
      )
  }
  /**
   * 
   * @param TeamIndex 根据团队成员的AuthKey查询团队成员信息，若查询不到，返回search_team_error
   */
  public static SearchMember(TeamIndex: Teaminfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAMMEMBER_CONFIG.INDEX + '/' + TEAMMEMBER_CONFIG.SEARCH,
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
  /**
   * 
   * @param teamauthKey 同时根据团队成员中的AuthKey和TeamKey查询团队成员
   */
  public static SearchMemberByTAuth(teamauthKey: TeamInfo): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      TEAMMEMBER_CONFIG.INDEX + '/' + TEAMMEMBER_CONFIG.SEARCH,
      {
        "query": {
          "bool": {
            "must": [{ "match": { "AuthKey.range.keyword": teamauthKey.AuthKey.range } },
            { "match": { "TeamKey.range.keyword": teamauthKey.TeamKey.range } }]
          }
        }
      }
    ).pipe(
      map((result: any) => {
        if (
          result.hits.total.value >= 1) {
          return throwError(new Error('cun_zai_liang_ge_yong_hu'));
        } else if (result.hits.total.value == 0) {
          return false;
        } else {
          // TODO:
          // console.log("")
        }
      }),
    );
  }

}

