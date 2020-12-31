import { Body, Controller, Headers, Post, ValidationPipe } from '@nestjs/common';
import { of, pipe, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Errorcode } from 'src/common/error.code';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { TEAM_CONFIG } from './team.config';
import { Teaminfo, TeamInfo, TeamInfoInterface, TeamMember } from './team.interface';
import { TeamService } from './team.service';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');
import { AuthService } from 'src/auth/auth.service';

@Controller('team')
export class TeamController {
  log = 'TeamController';


  @Post('insertteaminfo')
  insertuserinfo(@Body(ValidationPipe) sendData: TeamInfoInterface, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    console.log(TeamMemberInfo)
    let TeamMemberKey = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
    }
    let TeamMemberRole = TeamMemberInfo.role
    if (TeamMemberRole == 'admin' || TeamMemberRole == 'our') {
      return TeamService.insertteaminfo({
        hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
        range: uuid.v4(),
        index: TEAM_CONFIG.INDEX,
        teamname: sendData.teamname,
        projectname: sendData.projectname,
        projectprogress: sendData.projectprogress,
        // membername: sendData.membername,
        teamMemberKey: TeamMemberKey,
      }).pipe(
        catchError((err) => {
          let redata: BackCodeMessage = {
            code: Errorcode[err.message],
            message: err.message,
          };
          return of(redata);
        }),
      );
    }
    if (TeamMemberRole == 'menber') {
      return throwError(new Error('teammember_donot_haveright')).pipe(
        catchError((err) => {
          let redata: BackCodeMessage = {
            code: Errorcode[err.message],
            message: err.message,
          };
          return of(redata);
        }),
      )
    }
  }

  @Post('searchbyteamindex')
  searchteaminfo(
    @Body(ValidationPipe) TeamIndex: TeamInfo,
  ): any {
    return TeamService.SearchTeam(TeamIndex).pipe(
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }),
    );
  }


  @Post('updateteaminfo')
  userinfoupdate(@Body(ValidationPipe) sendData: TeamInfoInterface, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    let vertifyInfo = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
      role: TeamMemberInfo.role
    }
    let TeamMemberKey = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
      role: TeamMemberInfo.role,
    }
    console.log(TeamMemberInfo)
    let TeamMemberRole = TeamMemberInfo['role']
    return TeamService.SearchMemberReturn(vertifyInfo)
      .pipe(
        switchMap((data) => {
          if (TeamMemberRole == 'admin' || TeamMemberRole == 'our') {
            if (data && data.range) {
              return TeamService.UpdateTeamInfo({
                hash: data.hash,
                range: data.range,
                index: data.index,
                teamname: sendData.teamname,
                projectname: sendData.projectname,
                projectprogress: sendData.projectprogress,
                teamMemberKey: vertifyInfo
              })
            } else if (data == '000109') {
              return TeamService.insertteaminfo({
                hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
                range: uuid.v4(),
                index: TEAM_CONFIG.INDEX,
                teamname: sendData.teamname,
                projectname: sendData.projectname,
                projectprogress: sendData.projectprogress,
                teamMemberKey: TeamMemberKey,
              })
            }
          }
          if (TeamMemberRole == 'menber') {
            throwError(new Error('team member does not have rights '))
          }
          else {
            // TODO:
          }
        }),
        catchError((err) => {
          console.log(
            this.log + 'update error',
            JSON.stringify(err),
            typeof err,
            err.message,
          );
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
   * @param sendData 插入团队成员信息
   * @param headers 
   */
  @Post('insertteammember')
  insertteammember(@Body(ValidationPipe) sendData: TeamMember, @Headers() headers): any {
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
    return TeamService.SearchTeamInfo(TeamKey).pipe(
      switchMap((result) => {
        if (result) {
          return TeamService.inteammemberinfo({
            hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
            range: uuid.v4(),
            index: TEAM_CONFIG.INDEX,
            TeamMemberName: sendData.TeamMemberName,
            position: sendData.position,
            role: 'menber',
            AuthKey: AuthKey,
            TeamKey: TeamKey
          })

        } else {
          return throwError(new Error('insert_team_not_found'));
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
   * 根据团队成员信息中的TeamKey查找所有的团队成员
   */
  @Post('steammember')
  teammembersearch(@Body(ValidationPipe) sendData: TeamMember): any {
    let TeamKey = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    return TeamService.SearchMemberReturn(TeamKey).pipe(
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