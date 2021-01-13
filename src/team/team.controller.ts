import { Body, Controller, Delete, Headers, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { of, pipe, throwError } from 'rxjs';
import { catchError, map, retry, switchMap } from 'rxjs/operators';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Errorcode } from 'src/common/error.code';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { TEAM_CONFIG } from './team.config';

import { TeamInfo, Teaminfo, TeamInfoInterface, TeamMember, Teamminterface } from './team.interface';
import { TeamService } from './team.service';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TEAMMEMBER_CONFIG } from 'src/teammember/team.config';

@Controller('team')
export class TeamController {
  log = 'TeamController';

  /**
   * 
   * @param sendData 插入团队信息，注释部分为解析用户idtoken的角色
   * @param headers 
   */
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
    // let TeamMemberRole = TeamMemberInfo.role
    // if (TeamMemberRole == 'admin' || TeamMemberRole == 'our') {
    return TeamService.insertteaminfo({
      hash: DynamoDBService.computeHash(TEAMMEMBER_CONFIG.INDEX),
      range: uuid.v4(),
      index: TEAMMEMBER_CONFIG.INDEX,
      teamid: sendData.teamid,
      teamname: sendData.teamname,
      projectid: sendData.projectid,
      projectname: sendData.projectname,
      projectprogress: sendData.projectprogress,
      description: sendData.description,
      type: sendData.type,
    }).pipe(
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }),
    );
    // }
    // if (TeamMemberRole == 'menber') {
    //   return throwError(new Error('teammember_donot_haveright')).pipe(
    //     catchError((err) => {
    //       let redata: BackCodeMessage = {
    //         code: Errorcode[err.message],
    //         message: err.message,
    //       };
    //       return of(redata);
    //     }),
    //   )
    // }
  }
  /**
   * 
   * @param TeamIndex 根据团队信息的hash,range,index查询团队信息
   */
  @Post('searchbyteamindex')
  // @UseGuards(new AuthGuard(Headers))
  searchteaminfo(@Body(ValidationPipe) TeamIndex: Teaminfo): any {
    return TeamService.SearchTeamInfo(TeamIndex).pipe(
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }),
    );
  }

  /**
   * 
   * @param sendData 更新团队信息
   */
  @Post('updateteaminfo')
  userinfoupdate(@Body(ValidationPipe) sendData: TeamInfoInterface): any {
    let teaminfo = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    return TeamService.SearchTeamInfo(teaminfo).pipe(
      switchMap((data) => {
        console.log('1111111111111111111111111', data)
        if (data && data.range) {
          return TeamService.UpdateTeamInfo({
            hash: data.hash,
            range: data.range,
            index: data.index,
            teamid: sendData.teamid,
            teamname: sendData.teamname,
            projectid: sendData.projectid,
            projectname: sendData.projectname,
            projectprogress: sendData.projectprogress,
            description: sendData.description,
            type: sendData.type
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
   * 
   * @param sendData 
   * @param headers 根据团队信息的hash,range,index删除团队信息
   */
  @Delete('deleteteaminfo')
  teaminfodelete(@Body(ValidationPipe) sendData: TeamMember, @Headers() headers): any {
    // let idtoken = headers['authorization'];
    // let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    let TeamKey = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index
    }
    // if (TeamMemberInfo.role == 'admin' || TeamMemberInfo.role== 'our') {
    return TeamService.SearchTeamInfo(TeamKey).pipe(
      switchMap((result) => {
        if (result) {
          return TeamService.DeleteTeamInfo({
            hash: sendData.hash,
            range: sendData.range,
            index: sendData.index,
          })
        } else {
          return throwError(new Error('team_not_found'));
        }
      }),
      catchError((err) => {
        let redata: BackCodeMessage = {
          code: Errorcode[err.message],
          message: err.message,
        };
        return of(redata);
      }))
    // }
    // if (TeamMemberInfo.role == 'menber') {
    //   return throwError(new Error('teammember_donot_haveright')).pipe(
    //     catchError((err) => {
    //       let redata: BackCodeMessage = {
    //         code: Errorcode[err.message],
    //         message: err.message,
    //       };
    //       return of(redata);
    //     }),
    //   )
    // }
  }
}

