import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
let OSS = require('ali-oss');
let STS = OSS.STS;
let sts = new STS({
  // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
  accessKeyId: 'LTAI4Fz4qHdwRBLaVuWAFWJw',
  accessKeySecret: 'olCiA3RPTAXvEFUiJa9WkVKX77ey5w',
});
@Controller('aliyun')
export class AliyunController {
  /**
   * 颁发sts访问权限
   */
  @Post('/assumerole')
  verifysmscoderegister(): any {
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
    async function assumeRole() {
      try {
        console.log('assumeRole start');
        let token = await sts.assumeRole(
          'acs:ram::1302229210323986:role/aliyunosstokengeneratorrole',
          policy,
          15 * 60,
          'AliyunOSSTokenGeneratorRole',
        );
        console.log('assumeRole start 2');
        console.log(
          'token.credentials.AccessKeyId',
          token.credentials.AccessKeyId,
        );
        console.log(token.credentials.AccessKeySecret);
        console.log(token.credentials.SecurityToken);
        let client = new OSS({
          region: 'oss-cn-beijing',
          accessKeyId: token.credentials.AccessKeyId,
          accessKeySecret: token.credentials.AccessKeySecret,
          stsToken: token.credentials.SecurityToken,
          bucket: 'hwquser',
        });
      } catch (e) {
        console.log('aliyun.controller', e);
      }
      return 'success';
    }
    assumeRole();
  }
}
