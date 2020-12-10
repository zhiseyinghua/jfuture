import { Dbinterface } from "src/common/db.elasticinterface";

export interface AuthuserInterface {
  hash: string;
  range: string;
  index: string;
  phone: string;
  role: 'menber' | 'admin' | 'our',
  encodepossword?: string;
  webbase64key?: string,
  timestamp : number,
  realname:any
}

export interface CreateIdtokenInterface{
  hash: string,
  range: string,
  index: string,
  role:  'menber' | 'admin' | 'our',
  phone: string,
  timestamp: number,
  realname: string,
  device: string;
  platform: string
}

/**
 * indoken Payload 部分的信息 
 */
export interface AuthuserIdtokenInterface{
  role:  'menber' | 'admin' | 'our',
  timestamp: number,
  realname: string,
  hash: string;
  range: string;
  index: string;
  phone: string;
  // 签发人
  iss: "future_time";
  // 受众
  sub: "member";
  // 签发时间
  iat: number;
  // 设备码
  device: string;
  platform: string
}

export interface idToken extends Dbinterface {
    phone: string,
    role: string,
    timestamp: number,
    iat: number,
    iss: "future_time",
    sub: "member",
    exp: number
}

export interface SendPhoneSMS {
  mobile: '18779868511';
  devices: 'phone' | 'web';
}

/**
 * 注册，重置密码前端发送过来的数据接口
 * msg_id为调用发送验证码API的返回值
 */
export interface LoginWithSMSVerifyCodeInput {
  phone:string
  msg_id: string;
  code: string;
  provider: 'phone' | 'web';
  encodepossword: string
  device: string;
  platform: string
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

/**
 * 密码登录的接口
 */
export interface GetuserbyphonenumberInterface {
  phone: string,
  encodepossword: string
  device: string;
  platform: string
}





// export interface ResetposswordInterface {

// }


export interface BackidtokenInterface{
  idtoken: string
  status: 'success'
}
