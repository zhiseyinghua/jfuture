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
      role: TeamMemberInfo.role,
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
      return Errorcode.teammember_donot_haveright
    }
  }

  @Post('searchbyteamindex')
  searchteaminfo(
    @Body(ValidationPipe) TeamIndex: TeamInfo,
  ): any {
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


  @Post('updateteaminfo')
  userinfoupdate(@Body(ValidationPipe) sendData: TeamInfoInterface, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    let vertifyInfo = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
      role:TeamMemberInfo.role
    }
    let TeamMemberKey = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
      role: TeamMemberInfo.role,
    }
    console.log(TeamMemberInfo)
    let TeamMemberRole = TeamMemberInfo['role']
    return TeamService.SearchMemberByTMK(vertifyInfo)
      .pipe(
        switchMap((data) => {
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
          } else if (data == 'user_error') {
            throwError(new Error('cun zai liang ge yong hu '))
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

  @Post('insertteammember')
  insertteammember(@Body(ValidationPipe) sendData: TeamMember, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    console.log(TeamMemberInfo)
    let AuthKey = {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
    }
    let TeamKey = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    return TeamService.SearchMemberByTK(TeamKey).pipe(

      map((result) => {
        console.log(result)
        if (
          result == "000109"
        ) {
          return TeamService.inteammemberinfo({
            hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
            range: uuid.v4(),
            index: TEAM_CONFIG.INDEX,
            TeamMemberName: sendData.TeamMemberName,
            position: sendData.position,
            role: sendData.role,
            AuthKey: AuthKey,
            TeamKey: TeamKey
          })
        }
        if (result && result.range) {
          throwError(new Error('the teammember has already exit '))
        }
        // catchError((err) => {
        //   let redata: BackCodeMessage = {
        //     code: Errorcode[err.message],
        //     message: err.message,
        //   };
        //   return of(redata);
        // }),
      }))
  }
}