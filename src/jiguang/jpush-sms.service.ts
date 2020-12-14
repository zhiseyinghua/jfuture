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
export class JPushSMSService {
  static readonly TAG = 'JPushSMSService';

  public static sendSMSVerficiationCode(
    mobilePhoneNumber: string,
  ): Observable<any> {
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
    return from(Axios.default.request(axiosRequestConfig)).pipe(
      switchMap((response) => {
        // console.log(this.TAG, 'sendSMSVerficiationCode', response);
        return of(response.data);
      }),
      catchError((error) => {
        // console.error(this.TAG, 'got error', error);
        return throwError(error);
      }),
    );
  }

  /**
   * 这是一个验证短信验证码是否正确的方法
   * @param verifyInput
   */
  public static verifySmsCode(
    verifyInput: JPushSMSCodeVerificationRequest,
  ): Observable<any> {
    console.log('JPushSMSService verifySmsCode verifyInput', verifyInput);
    let authorizationBase64Header =
      'Basic ' +
      Base64.encode(JPUSH_CONFIG.AppKey + ':' + JPUSH_CONFIG.MasterSecret);
    console.log(authorizationBase64Header);
    let axiosRequestConfig: Axios.AxiosRequestConfig = {
      baseURL:
        JPUSH_CONFIG.EndPoints.SMSSendTextCode +
        '/' +
        verifyInput.msg_id +
        '/valid',
      data: {
        code: verifyInput.code,
      },
      headers: { Authorization: authorizationBase64Header },
      method: 'post',
    };

    return from(Axios.default.request(axiosRequestConfig)).pipe(
      map((response) => {
        // console.log(this.TAG, 'verifySmsCode', response);
        return response.data;
      }),
      catchError((error) => {
        console.log('error', error.response.data.error.message);
        if ((error.response.data.error.message = 'invalid code')) {
          console.log(
            'yan zheng ma error',
            
          );
          return of(AutherrorCode.verification_code_error,);
        } else {
          return throwError(new Error(error.response.data.error.message));
        }
      }),
    );
  }
}


