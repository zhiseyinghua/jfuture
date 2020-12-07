interface Authuser {
  hash: string;
  range: string;
  index: string;
  username: string;
  phoneNumber: string;
  // possword:string,
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
export interface logindatainterface {
  hash: string;
  range: string;
  index: string;
  encodepossword: string;
  phone: string;
  email:string;
  provider?: 'phone' | 'web';
}

// const logindatainterfacedata: logindatainterface = {
//   "hash":"1",
//   "range":"1",
//   "index":"1",
//   "encodepossword":"1234",
//   "phone":"18779868511",
//   "email":""
// }

