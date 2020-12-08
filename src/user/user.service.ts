import { Injectable } from '@nestjs/common';
import { UserInfoInterface} from'./user.interface';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { from, Observable } from 'rxjs';
import uuid = require('uuid');
import { AUTH_CONFIG } from 'src/auth//auth.config';

@Injectable()
export class UserService {
    public static logger = 'UserService';
    static storeUserInfo(data: UserInfoInterface): Observable<any> {
        console.log(this.logger + 'storeUserinfo data', data);
        let eldata: UserInfoInterface = {
          hash: DynamoDBService.computeHash(AUTH_CONFIG.INDEX),
          range: uuid.v4(),
          index: '',
          userid:'',
          usernickname:'',
          telephone:'',
          usermail:'',
          userico:'',
        };
        console.log(this.logger + 'storeUserinfo data', data);
        console.log(this.logger, 'storeUserinformation eldata', eldata);
        return DbElasticService.executeInEs(
          'put',
           AUTH_CONFIG.INDEX + '/' + AUTH_CONFIG.DOC + '/' + eldata.range,
           eldata,
        );
      }
}

