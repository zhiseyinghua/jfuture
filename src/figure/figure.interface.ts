import { Dbinterface } from 'src/common/db.elasticinterface';

export interface OrderInterface extends Dbinterface {
  // 地点
  localPlace: OrderlocalPlaceInterface;
  // 项目开始时间
  figuetime:string;
  // 项目的状态
  figueState:string
  // 不动产测试   一次性测试
  type: 'realEstateTest' | 'oneTimeTest';
  // 预估时间
  estimatedTime: Number;
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
  timeReceiptAmount: Number;
  // 预估费用
  estimatedMoney: string;
  // 实际费用
  realMoney: string;
  // 甲方信息
  ONEinformation: {
    // 电话
    phone: string;
    // 邮箱
    email: string;
    name: string;
  };
  timestamp:number
  // 在哪个所属团队发的任务
  creatorkey?: Dbinterface;
}
export interface OrderlocalPlaceInterface {
  lng: number;
  lat: number;
  local: string;
}

/**
 * 第一次put一个订单到数据库
 */
export interface PutOrderOne extends Dbinterface {
  ordername:string;
  localPlace: OrderlocalPlaceInterface;
  type: OrderType;
  estimatedTime: Number;
  area: string;
  creatorkey: Dbinterface;
  // 预估费用
  estimatedMoney: string;
  // 甲方信息
  ONEinformation: {
    // 电话
    phone: string;
    // 邮箱
    email: string;
    name: string;
  };
  timestamp:number
}

export type OrderType = 'realEstateTest' | 'oneTimeTest';
const data: PutOrderOne = {
  hash:'',
  range:'',
  index:'',
  localPlace: {
    lng:123,
    lat:123,
    local:''
  },
  type: 'oneTimeTest',
  estimatedTime: 123654789,
  area: '123',
  creatorkey: {
    hash:'',
    range:'',
    index:''
  },
  ordername:'123',
  estimatedMoney:'123',
  // 甲方信息
  ONEinformation: {
    // 电话
    phone: 'string',
    // 邮箱
    email: '123',
    name: '123'
  },
  timestamp: 123
}
