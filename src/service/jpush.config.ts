export const JPUSH_CONFIG = {
  PROVIDER_NAME: 'jpush',
  AppKey:'984b7e6efb3381de3b5bea5a',
  MasterSecret:'9c8c4c41c17329a8b549def8',
  EndPoints: {
    SMSSendTextCode: 'https://api.sms.jpush.cn/v1/codes',
    SMSVerifyCode: 'https://api.sms.jpush.cn/v1/codes/',
    JPUSH_V3: 'https://api.jpush.cn/v3/push',
    JPUSH_V3_CID: 'https://api.jpush.cn/v3/push/cid',
  },
  SMS: {
    SMSTemplate: { SMSLoginTemplate: 1, DefaultTemplate: 1 },
    SMSSignID: { ChainCChinese: 16235 },
  },
  INTENT: {
    URL_SCHEME: 'chaincapp',
  },
};
