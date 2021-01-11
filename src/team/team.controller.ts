import { Body, Controller, Delete, Headers, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { of, pipe, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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

@Controller('team')
export class TeamController {
  log = 'TeamController';

  /**
   * 
   * @param sendData 插入团队信息，若auth的idtoken中角色为成员，则返回错误信息
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
        hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
        range: uuid.v4(),
        index: TEAM_CONFIG.INDEX,
        teamid: sendData.teamid,
        teamname: sendData.teamname,
        projectid: sendData.projectid,
        projectname: sendData.projectname,
        projectprogress: sendData.projectprogress,
        description: sendData.description,
        type:sendData.type,
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
   * @param TeamIndex 查询团队信息
   */
  @Post('searchbyteamindex')
  // @UseGuards(new AuthGuard(Headers))
  searchteaminfo(@Body(ValidationPipe) TeamIndex: Teaminfo): any {
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


  // @Post('updateteaminfo')
  // userinfoupdate(@Body(ValidationPipe) sendData: TeamInfoInterface, @Headers() headers): any {
  //   let idtoken = headers['authorization'];
  //   let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
  //   let vertifyInfo = {
  //     hash: TeamMemberInfo.hash,
  //     range: TeamMemberInfo.range,
  //     index: TeamMemberInfo.index,
  //     role: TeamMemberInfo.role
  //   }
  //   let TeamMemberKey = {
  //     hash: TeamMemberInfo.hash,
  //     range: TeamMemberInfo.range,
  //     index: TeamMemberInfo.index,
  //     role: TeamMemberInfo.role,
  //   }
  //   console.log(TeamMemberInfo)
  //   let TeamMemberRole = TeamMemberInfo['role']
  //   return TeamService.SearchMemberReturn(vertifyInfo)
  //     .pipe(
  //       switchMap((data) => {
  //         if (TeamMemberRole == 'admin' || TeamMemberRole == 'our') {
  //           if (data && data.range) {
  //             return TeamService.UpdateTeamInfo({
  //               hash: data.hash,
  //               range: data.range,
  //               index: data.index,
  //               teamid:sendData.teamid,   
  //               teamname:sendData.teamname,   
  //               projectid:sendData.projectid,   
  //               projectname:sendData.projectname,   
  //               projectprogress:sendData.projectprogress,   
  //               description:sendData.description,  
  //               type:sendData.type,
  //               teamMemberKey: vertifyInfo
  //             })
  //           } else if (data == '000109') {
  //             return TeamService.insertteaminfo({
  //               hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
  //               range: uuid.v4(),
  //               index: TEAM_CONFIG.INDEX,
  //               teamid:sendData.teamid,   
  //               teamname:sendData.teamname,   
  //               projectid:sendData.projectid,   
  //               projectname:sendData.projectname,   
  //               projectprogress:sendData.projectprogress,   
  //               description:sendData.description,  
  //               type:sendData.type,
  //               teamMemberKey: TeamMemberKey,
  //             })
  //           }
  //         }
  //         if (TeamMemberRole == 'menber') {
  //           throwError(new Error('team member does not have rights '))
  //         }
  //         else {
  //           // TODO:
  //         }
  //       }),
  //       catchError((err) => {
  //         console.log(
  //           this.log + 'update error',
  //           JSON.stringify(err),
  //           typeof err,
  //           err.message,
  //         );
  //         let redata: BackCodeMessage = {
  //           code: Errorcode[err.message],
  //           message: err.message,
  //         };
  //         return of(redata);
  //       })
  //     )
  // }

    @Post('updatememberinfo')
  memberinfoupdate(@Body(ValidationPipe) sendData: TeamMember, @Headers() headers): any {
    let idtoken = headers['authorization'];
    let userinfo = AuthService.decodeIdtoken(idtoken);
    let AuthInfo = {
      hash: userinfo.hash,
      range: userinfo.range,
      index: userinfo.index,
    }
   console.log(AuthInfo)
    return TeamService.SearchMemberByTA(AuthInfo)
      .pipe(
        switchMap((data) => {
          console.log('updatememberinfo ByAuthkey data', data);
          if (data && data.range) {
            return TeamService.UpdateMemberInfo({
              hash:data.hash,
              range:data.range,
              index:data.index,
              TeamMemberName: sendData.TeamMemberName,
              gender: sendData.gender,
              age: sendData.age,
              position: sendData.position,
              img: sendData.img,
              description: sendData.description,
              birth: sendData.birth
            })
          }
          //  else if (data == 'user_error') {
          //   throwError(new Error('cun zai liang ge yong hu '))
          // } 
          // else if (data == false) {
          //   return TeamService.inteammemberinfo({
          //     role: 'menber',
          //     TeamKey: data.TeamKey,
          //     AuthKey: data.AuthKey,
          //   })
          // }
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
        })
      )
  }
  /**
   * 
   * @param sendData 插入团队成员信息
   * @param headers  注释部分为idtoken的权限设置
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


  @Delete('deleteteammember')
  teammemberdelete(@Body(ValidationPipe) sendData: Teaminfo): any {
    let TeamKey = {
      hash: sendData.hash,
      range: sendData.range,
      index: sendData.index,
    }
    return TeamService.SearchTeamInfo(TeamKey).pipe(
      switchMap((result) => {
        if (result) {
          return TeamService.DeleteTeamMember({
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
    return TeamService.SearchTeamInfo(TeamKey).pipe(
      switchMap((result) => {
        if (result) {
          return TeamService.inteammemberinfo({
            hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
            range: uuid.v4(),
            index: TEAM_CONFIG.INDEX,
            role: 'menber',
            AuthKey: AuthKey,
            TeamKey: TeamKey
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
  }
  @Post('steam')
  teamsearch( @Headers() headers): any {
    let idtoken = headers['authorization'];
    let TeamMemberInfo = AuthService.decodeIdtoken(idtoken);
    let AuthKey= {
      hash: TeamMemberInfo.hash,
      range: TeamMemberInfo.range,
      index: TeamMemberInfo.index,
    }
    return TeamService.SearchMemberByAuth(AuthKey).pipe(
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

