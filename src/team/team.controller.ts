import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TeamInfo, TeamInfoInterface } from './team.interface';
import { TeamService } from './team.service';
import { TeamErrorCode } from './TeamErrorCode';

@Controller('team')
export class TeamController {
    log = 'TeamController';

@Post('insertteaminfo')
insertteaminfo(@Body(ValidationPipe) data: TeamInfoInterface): any {
    return TeamService.InsertTeamInfo(data).pipe(
        switchMap((result) => {
          if (result == true) {
            return TeamService.InsertTeamInfo({
                hash:'',
                range:'',
                index:'',
                teamname:data.teamname,
                projectname:data.projectname,
                projectprogress:data.projectprogress,
                membername:data.membername,
            });
          } else {
            return throwError(new Error(TeamErrorCode.insert_error));
          }
        }),
    )
}
}
