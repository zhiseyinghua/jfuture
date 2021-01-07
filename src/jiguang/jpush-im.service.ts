import { Base64 } from 'js-base64';
import * as Axios from 'axios';
import { from, Observable, of, throwError } from 'rxjs';
import { JPUSH_CONFIG } from 'src/service/jpush.config';
import {
  JPushSMSCodeVerificationRequest,
  JPushSMSSendCodeRequest,
} from './jpush.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AutherrorCode } from 'src/auth/auth.code';

/**
 * 极光发送服务
 */
export class JpushIMService {
  static readonly TAG = 'JpushIMService';
  pushMessage() {
    let authorizationBase64Header =
      'Basic' +
      ' ' +
      Base64.encode(JPUSH_CONFIG.AppKey + ':' + JPUSH_CONFIG.MasterSecret);
    let requestBody: JPushSMSSendCodeRequest = {
      mobile: mobilePhoneNumber,
      sign_id: JPUSH_CONFIG.SMS.SMSSignID.ChainCChinese,
      temp_id: JPUSH_CONFIG.SMS.SMSTemplate.SMSLoginTemplate,
    };
    let axiosRequestConfig: Axios.AxiosRequestConfig = {
      baseURL: JPUSH_CONFIG.EndPoints.SMSSendTextCode,
      data: requestBody,
      headers: { Authorization: authorizationBase64Header },
      method: 'post',
    };
    console.log('auth', authorizationBase64Header);
  }
}
