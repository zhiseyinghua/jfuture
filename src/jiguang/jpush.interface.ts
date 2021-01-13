import { Dbinterface } from 'src/common/db.elasticinterface';

export interface JPushSMSSendCodeRequest {
  mobile: string;
  sign_id: number;
  temp_id: number;
}

/**
 * 验证手机验证码接口
 */
export interface JPushSMSCodeVerificationRequest {
  msg_id: string;
  code: string;
  provider: string;
}


