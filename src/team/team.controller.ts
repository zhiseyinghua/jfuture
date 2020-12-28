import { Body, Controller, Headers, Post, ValidationPipe } from '@nestjs/common';
import { of, pipe, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Errorcode } from 'src/common/error.code';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { TEAM_CONFIG } from './team.config';
import { TeamInfo, TeamInfoInterface, TeamMember } from './team.interface';
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
    let TeamMemberKey={
      hash:TeamMemberInfo.hash,
      range:TeamMemberInfo.range,
      index:TeamMemberInfo.index,
      role:TeamMemberInfo.role,
    }
    let TeamMemberRole=TeamMemberInfo.role
    if (TeamMemberRole == 'admin' ||TeamMemberRole == 'our') {
      return TeamService.insertteaminfo({
        hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
        range: uuid.v4(),
        index: TEAM_CONFIG.INDEX,
        teamname: sendData.teamname,
        projectname: sendData.projectname,
        projectprogress: sendData.projectprogress,
        // membername: sendData.membername,
        teamMemberKey:TeamMemberKey,
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
    if(TeamMemberRole == 'menber'){
      return TeamErrorCode.teammember_donot_haveright
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
    let TeamMemberRole=TeamMemberInfo['teamMemberKey']['our']
    if (TeamMemberRole == 'admin' ||TeamMemberRole == 'owner') {
      return TeamService.UpdateTeamInfo({
        teamname: sendData.teamname,
        projectname: sendData.projectname,
        projectprogress: sendData.projectprogress,
        // membername: sendData.membername,
        hash:TeamMemberInfo.hash,
        range:TeamMemberInfo.range,
        index:TeamMemberInfo.index,
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
    if(TeamMemberRole == 'menber'){
      return TeamErrorCode.teammember_donot_haveright
    }
  }  

@Post('insertteammember')
  insertteammember(@Body(ValidationPipe) sendData:TeamMember, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    console.log(TeamMemberInfo)
    let AuthKey={
      hash:TeamMemberInfo.hash,
      range:TeamMemberInfo.range,
      index:TeamMemberInfo.index,
    }
      return TeamService.inteammemberinfo({
        hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
        range: uuid.v4(),
        index: TEAM_CONFIG.INDEX,
        TeamMemberName:sendData.TeamMemberName,
        position:sendData.position,
        role:sendData.role,  
        AuthKey: AuthKey ,
        // TeamKey:
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
  }                    

