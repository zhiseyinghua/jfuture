interface Authuser {
  hash: string;
  range: string;
  index: string;
  username: string;
  phoneNumber: string;
  role: 'menber' | 'admin' | 'our',
  // encodepossword: string;
}

export interface SendPhoneSMS {
  mobile: '18779868511';
  devices: 'phone' | 'web';
}

/**
 * 注册，前端发送过来的数据接口
 * msg_id为调用发送验证码API的返回值
 */
export interface LoginWithSMSVerifyCodeInput {
  phone:string
  msg_id: string;
  code: string;
  provider: 'phone' | 'web';
  encodepossword: string
}

/**
 * 注册时用的数据
 */
export interface Logindatainterface {
  hash: string;
  range: string;
  index: string;
  encodepossword: string;
  phone: string;
  email:string;
  provider?: 'phone' | 'web';
  // 注册时间
  timestamp : number,
  role: 'menber' | 'admin' | 'our'

}

export interface GetuserbyphonenumberInterface {
  phoneNumber: string
}

// expect interface CreateJWTtoken extends Logindatainterface {
//   JWTTime: number
// }

// const logindatainterfacedata: logindatainterface = {
//   'hash':'1',
//   'range':'1',
//   'index':'1',
//   'encodepossword':'1234',
//   'phone':'18779868511',
//   'email':''
// }

