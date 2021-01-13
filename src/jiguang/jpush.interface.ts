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

export interface OrderInterface extends Dbinterface {
  // 地点
  localPlace: any;
  // 不动产测试   一次性测试
  type: 'realEstateTest' | 'oneTimeTest';
  // 预估时间
  estimatedTime: string;
  // 面积
  area: any;
  // 创建者
  creator: Dbinterface;
  // 技术员
  technician: Dbinterface;
  // 实际派发时间
  timeAfterDistribution: Number;
  // 技术员实际完成时间
  technicianCompletionTime: Number;
  // 外业完成时间
  completionTime: Number;
  // 内业完成时间
  insidePagesFinish: Number;
  // 合同完成时间
  contractCompleted: Number;
  // 金额到账时间
  timeReceiptAmount:Number;
  // 预估费用
  estimatedMoney:string;
  // 实际费用
  realMoney: string;
  // 甲方信息
  ONEinformation:{
    // 电话
    phone:string
    // 邮箱
    email:string
    name: string
  };
  // 创建任务的人
  userkey:Dbinterface
  // 在哪个所属团队发的任务
  teamkey: Dbinterface
}  
