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
 * 注册/登了，前端发送过来的数据接口
 * msg_id为调用发送验证码API的返回值
 */
export interface LoginWithSMSVerifyCodeInput {
  msg_id: string;
  code: string;
  provider: string;
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
  email:string
}


