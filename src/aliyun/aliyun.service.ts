import { Injectable } from '@nestjs/common';
let OSS = require('ali-oss');
let STS = OSS.STS;
let sts = new STS({
  // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
  accessKeyId: '<Your AccessKeyId>',
  accessKeySecret: '<Your AccessKeySecret>',
});

@Injectable()
export class AliyunService {
  // public static TSTAllotOSSJurisdiction() {
  //     a
  // }
}
async function assumeRole() {
  try {
    let token = await sts.assumeRole(
      '<role-arn>',
      '<policy>',
      '<expiration>',
      '<session-name>',
    );
    let client = new OSS({
      region: '<region>',
      accessKeyId: token.credentials.AccessKeyId,
      accessKeySecret: token.credentials.AccessKeySecret,
      stsToken: token.credentials.SecurityToken,
      bucket: '<bucket-name>',
    });
  } catch (e) {
    console.log(e);
  }
}
