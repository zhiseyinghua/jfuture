import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
let OSS = require('ali-oss');
let STS = OSS.STS;
// TODO: accessKey不能写在代码里
let sts = new STS({
  accessKeyId: 'LTAI4FzhWZeAwa3obyfrFRet',
  accessKeySecret: '8Y8m7JfA6GR1MFztAfBZ0euL7O1Qj6',
});
@Injectable()
export class AliyunService {
  public static TSTAllotOSSJurisdiction(): Observable<any> {
    let policy = {
      "Statement": [
        {
            "Action": "oss:*",
            "Effect": "Allow",
            "Resource": "*"
        }
    ],
    "Version": "1"
    };
    console.log('start');
    return from(
      sts.assumeRole(
        'acs:ram::1302229210323986:role/futuretime',
        policy,
        60 * 60,
        'alice',
      ),
    );
  }
}
