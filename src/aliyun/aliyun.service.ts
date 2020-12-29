import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
let OSS = require('ali-oss');
let STS = OSS.STS;
// TODO: accessKey不能写在代码里
let sts = new STS({
  accessKeyId: 'LTAI4Fz4qHdwRBLaVuWAFWJw',
  accessKeySecret: 'olCiA3RPTAXvEFUiJa9WkVKX77ey5w',
});
@Injectable()
export class AliyunService {
  public static TSTAllotOSSJurisdiction(): Observable<any> {
    let policy = {
      Statement: [
        {
          Action: ['oss:Get*', 'oss:List*'],
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '1',
    };
    console.log('start');
    return from(
      sts.assumeRole(
        'acs:ram::1302229210323986:role/futuretime',
        policy,
        15 * 60,
        'alice',
      ),
    );
  }
}
