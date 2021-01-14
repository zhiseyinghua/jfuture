import { Body, Controller, Post, ValidationPipe, Headers, Delete } from '@nestjs/common';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Errorcode } from 'src/common/error.code';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { TEAM_CONFIG } from 'src/teammember/teammember.config';
import { TeamMember } from './teammember.interface';
import { TeammemberService } from './teammember.service';
import uuid = require('uuid');
import { Teaminfo, Teamminterface } from 'src/team/team.interface';
import { TEAMMEMBER_CONFIG } from './team.config';
import { TeamService } from 'src/team/team.service';
import { Dbinterface } from 'src/common/db.elasticinterface';

@Controller('teammember')
export class TeammemberController {

/**
 * 
 * @param sendData 根据用户输入的团队成员的hash,range,index更新团队成员信息
 */
  @Post('updateteammember')
  teammemberupdate(@Body(ValidationPipe) sendData: TeamMember): any {
    let teaminfo = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    return TeammemberService.SearchTeamMember(teaminfo).pipe(
      switchMap((data) => {
        if (data && data.range) {
          return TeammemberService.UpdateMemberInfo({
            hash: data.hash,
            range: data.range,
            index: data.index,
            TeamMemberName: sendData.TeamMemberName,
            gender: sendData.gender,
            age: sendData.age,
            position: sendData.position,
            img: sendData.img,
            description: sendData.description,
            birth: sendData.birth,
            role: sendData.role
          })
        }
        else {
          // TODO:
        }
      }),
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }),
    )
  }

  /**
   * 根据团队成员信息中的TeamKey查找所有的团队成员
   */
  @Post('searchteammember')
  teammembersearch(@Body(ValidationPipe) sendData: TeamMember): any {
    let TeamKey = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    return TeammemberService.SearchMemberReturn(TeamKey).pipe(
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      })
    )
  }

  /**
   * 
   * @param sendData 根据输入的hash range index删除成员
   */
  @Post('deleteteammember')
  teammemberdelete(@Body(ValidationPipe) sendData: Teaminfo): any {
    let TeamKey = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    return TeammemberService.SearchTeamMember(TeamKey).pipe(
      switchMap((result) => {
        if (result) {
          return TeammemberService.DeleteTeamMember({
            hash: sendData.hash,
            range: sendData.range,
            index: sendData.index,
          })
        } else {
          return throwError(new Error('teammember_not_found'));
        }
      }),
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }))
  }
  /**
   * 
   * @param sendData 
   * @param headers 输入团队信息和解析的idtoken实现团队成员的插入，默认角色为成员，且并无其他字段信息
   */
  @Post('insertteammember')
  insertteammember(@Body(ValidationPipe) sendData: Teamminterface, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    console.log(TeamMemberInfo)
    let TeamKey = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    let AuthKey = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
    }
    let teamauthdata = {
      TeamKey: TeamKey,
      AuthKey: AuthKey,
    }
    return TeammemberService.SearchTeamInfo(TeamKey).pipe(
      switchMap((result) => {
        if (result) {
          return TeammemberService.SearchMemberByTAuth(teamauthdata).pipe(
            switchMap((data) => {
              if (data == false) {
                return TeammemberService.inteammemberinfo({
                  hash: DynamoDBService.computeHash(TEAMMEMBER_CONFIG.INDEX),
                  range: uuid.v4(),
                  index: TEAMMEMBER_CONFIG.INDEX,
                  role: 'menber',
                  AuthKey: AuthKey,
                  TeamKey: TeamKey
                })
              }
              if (data) {
                return throwError(new Error('cun_zai_liang_ge_yong_hu'))
              }
            }
            ),
            catchError((err) => {
              let redata: BackCodeMessage = {
                code: Errorcode[err.message],
                message: err.message,
              };
              return of(redata);
            }),
          )
        }
        else {
          catchError((err) => {
            let redata: BackCodeMessage = {
              code: Errorcode[err.message],
              message: err.message,
            };
            return of(redata);
          })
        }
      }),
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      })

    )
  }
  /**
   * 
   * @param headers 根据解析出来的idtoken查询用户所加入的团队名称
   */
  @Post('searchteamname')
  teamsearch(@Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    let AuthKey = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
    }
    return TeammemberService.SearchMember(AuthKey).pipe(
      switchMap((data) => {
        var team = new Array()
        for (let i = 0; i <= (data.hits.total.value) - 1; i++) {
          team[i] = {
            hash: data.hits.hits[i]._source.TeamKey.hash,
            range: data.hits.hits[i]._source.TeamKey.range,
            index: data.hits.hits[i]._source.TeamKey.index,
          }
        }
        return of(team)
      }),
      switchMap((teamkeylist: Dbinterface[]) => {
        // return TeamService.SearchTeam(teamkeylist)
        let teamforj = []
        teamkeylist.forEach(element => {
          teamforj.push(TeamService.SearchTeam(element))
        });
        return forkJoin(teamforj);
      }),
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      })
    )
  }
}
