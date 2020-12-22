import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Errorcode } from 'src/common/error.code';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { TEAM_CONFIG } from './team.config';
import { TeamInfo, TeamInfoInterface } from './team.interface';
import { TeamService } from './team.service';
import { TeamErrorCode } from './TeamErrorCode';
import uuid = require('uuid');

@Controller('team')
export class TeamController {
  log = 'TeamController';

  @Post('insertteaminfo')
  insertteaminfo(@Body(ValidationPipe) data: TeamInfoInterface): any {
    return TeamService.insertteaminfo({
      hash: DynamoDBService.computeHash(TEAM_CONFIG.INDEX),
      range: uuid.v4(),
      index: TEAM_CONFIG.INDEX,
      teamname: data.teamname,
      projectname: data.projectname,
      projectprogress: data.projectname,
      membername: data.membername,
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
