export interface JPushSMSSendCodeRequest {
  mobile: string;
  sign_id?: number;
  temp_id: number;
}

export interface JPushSMSCodeVerificationRequest {
  code: string;
  msg_id: string;
}
