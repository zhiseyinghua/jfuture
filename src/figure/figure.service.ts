import { Injectable } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DynamoDBService } from 'src/service/dynamodb.serves';
import { DbElasticService } from 'src/service/es.service';
import { FIGURE_CONFIG } from './figure.config';
import uuid = require('uuid');
import {
  PutOrderOne,
  UpdateFirstinformation,
  UpdateOneMessage,
  UpdateOtherFormation,
  UpdateTime,
} from './figure.interface';
import {
  commonqueryInterface,
  DbElasticinterfacePutReturn,
  Dbinterface,
  Queryface,
  Queryinterface,
  QueryinterfaceHitList,
} from 'src/common/db.elasticinterface';
import { Observable, of } from 'rxjs';
import { BackCodeMessage } from 'src/common/back.codeinterface';
import { Errorcode } from 'src/common/error.code';
import { FigureEerrorCode } from './figure.code';

@Injectable()
export class FigureService {
  public static logger = 'AuthService';
  public static putOrder(
    data: PutOrderOne,
    authkey: Dbinterface,
  ): Observable<any> {
    let time = new Date().valueOf();
    let createIdtoken: PutOrderOne = {
      hash: DynamoDBService.computeHash(FIGURE_CONFIG.INDEX),
      range: uuid.v4(),
      index: FIGURE_CONFIG.INDEX,
      ordername: data.ordername,
      localPlace: data.localPlace,
      type: data.type,
      estimatedMoney: data.estimatedMoney,
      estimatedTime: data.estimatedTime,
      area: data.area,
      creatorkey: authkey,
      // 甲方信息
      ONEinformation: data.ONEinformation,
      timestamp: time,
      orderstartTime: time,
    };
    return DbElasticService.executeInEs(
      'PUT',
      FIGURE_CONFIG.INDEX + '/' + FIGURE_CONFIG.DOC + '/' + createIdtoken.range,
      createIdtoken,
    ).pipe(
      map((result) => {
        // return result;
        if (
          result &&
          result._shards &&
          result._shards.successful &&
          result._shards.successful >= 1
        ) {
          return createIdtoken;
        } else {
          let err = {
            code: '000005',
            meaage: 'server_error',
          };
          return err;
        }
      }),
    );
  }

  /**
   * 更新甲方信息
   * @param data
   */
  static firstinformation(data: UpdateFirstinformation): Observable<any> {
    return DbElasticService.executeInEs(
      'POST',
      FIGURE_CONFIG.INDEX +
        '/' +
        FIGURE_CONFIG.DOC +
        '/' +
        data.range +
        '/' +
        FIGURE_CONFIG.UPDATA,
      {
        doc: {
          ONEinformation: data.ONEinformation,
        },
      },
    ).pipe(
      map((reslutdata: DbElasticinterfacePutReturn) => {
        if (
          reslutdata &&
          reslutdata._shards &&
          reslutdata._shards.successful > 0
        ) {
          return data;
        } else if (
          reslutdata &&
          reslutdata._shards &&
          reslutdata._shards.successful == 0
        ) {
          let err = {
            code: '000203',
            message: 'Update_figure_existin',
          };
          return err;
        } else {
          let err = {
            code: '  000005',
            message: 'server_error',
          };
          return err;
        }
      }),
      catchError((errr) => {
        let err = {
          code: '000005',
          message: 'server_error',
        };
        return of(err);
      }),
    );
  }

  /**
   * 更新其他信息接口
   * @param data
   */
  static otherInformation(data: UpdateOtherFormation): Observable<any> {
    return DbElasticService.executeInEs(
      'POST',
      FIGURE_CONFIG.INDEX +
        '/' +
        FIGURE_CONFIG.DOC +
        '/' +
        data.range +
        '/' +
        FIGURE_CONFIG.UPDATA,
      {
        doc: {
          area: data.area,
          realMoney: data.realMoney,
        },
      },
    ).pipe(
      map((esresult: DbElasticinterfacePutReturn) => {
        console.log(esresult._shards.successful);
        if (
          esresult &&
          esresult._shards &&
          esresult._shards.successful &&
          esresult._shards.successful >= 1
        ) {
          return data;
        } else if (
          esresult &&
          esresult._shards &&
          esresult._shards.successful == 0
        ) {
          let message: BackCodeMessage = {
            code: Errorcode.update_figure_one_update_existing,
            message: FigureEerrorCode.update_figure_one_update_existing,
          };
          return message;
        } else {
          let message: BackCodeMessage = {
            code: Errorcode.update_figure_one_error,
            message: FigureEerrorCode.update_figure_one_error,
          };
          return message;
        }
      }),
    );
  }

  /**
   * 更新一个信息
   * @param data
   */
  static updateOneMessage(data: UpdateOneMessage): Observable<any> {
    var oneMessage = new Object();
    oneMessage[data.which] = data.value;
    return DbElasticService.executeInEs(
      'POST',
      FIGURE_CONFIG.INDEX +
        '/' +
        FIGURE_CONFIG.DOC +
        '/' +
        data.range +
        '/' +
        FIGURE_CONFIG.UPDATA,
      {
        doc: oneMessage,
      },
    ).pipe(
      map((esresult: DbElasticinterfacePutReturn) => {
        console.log(esresult._shards.successful);
        if (
          esresult &&
          esresult._shards &&
          esresult._shards.successful &&
          esresult._shards.successful >= 1
        ) {
          return data;
        } else if (
          esresult &&
          esresult._shards &&
          esresult._shards.successful == 0
        ) {
          let message: BackCodeMessage = {
            code: Errorcode.update_figure_one_update_existing,
            message: FigureEerrorCode.update_figure_one_update_existing,
          };
          return message;
        } else {
          let message: BackCodeMessage = {
            code: Errorcode.update_figure_one_error,
            message: FigureEerrorCode.update_figure_one_error,
          };
          return message;
        }
      }),
    );
  }

  /**
   * 更新时间信息
   * @param data
   */
  static updateTime(data: UpdateTime): Observable<any> {
    return DbElasticService.executeInEs(
      'POST',
      FIGURE_CONFIG.INDEX +
        '/' +
        FIGURE_CONFIG.DOC +
        '/' +
        data.range +
        '/' +
        FIGURE_CONFIG.UPDATA,
      {
        doc: {
          // 实际派发时间
          timeAfterDistribution: data.timeAfterDistribution,
          // 技术员实际完成时间
          technicianCompletionTime: data.technicianCompletionTime,
          // 外业完成时间
          completionTime: data.completionTime,
          // 内业完成时间
          insidePagesFinish: data.insidePagesFinish,
          // 合同完成时间
          contractCompleted: data.contractCompleted,
          // 金额到账时间
          timeReceiptAmount: data.timeReceiptAmount,
        },
      },
    ).pipe(
      map((esresult: DbElasticinterfacePutReturn) => {
        console.log(esresult._shards.successful);
        if (
          esresult &&
          esresult._shards &&
          esresult._shards.successful &&
          esresult._shards.successful >= 1
        ) {
          return data;
        } else if (
          esresult &&
          esresult._shards &&
          esresult._shards.successful == 0
        ) {
          let message: BackCodeMessage = {
            code: Errorcode.update_figure_one_update_existing,
            message: FigureEerrorCode.update_figure_one_update_existing,
          };
          return message;
        } else {
          let message: BackCodeMessage = {
            code: Errorcode.update_figure_one_error,
            message: FigureEerrorCode.update_figure_one_error,
          };
          return message;
        }
      }),
    );
  }
  /**
   * 查询很多
   * @param from
   * @param size
   */
  static getdbfigure(from: string, size: string): Observable<any> {
    return DbElasticService.executeInEs('POST', 'figure/_doc/_search', {
      query: {
        match_all: {},
      },
      from: from,
      size: size,
      sort: [
        {
          orderstartTime: {
            order: 'desc',
          },
        },
      ],
    }).pipe(
      map((result: Queryface) => {
        if (result._shards.successful == 1) {
          let newresult: commonqueryInterface = {
            list: [],
            maxsize: result.hits.total.value,
          };
          result.hits.hits.forEach((item, index) => {
            newresult.list.push(item['_source']);
          });
          return newresult;
        } else {
          let err = {
            code: '000005',
            message: 'server_error',
          };
          return err;
        }
      }),
      catchError((errr) => {
        let err = {
          code: '000005',
          message: 'server_error',
        };
        return of(err);
      }),
    );
  }

  /**
   * 根据order的key获取order
   * @param key
   */
  static bykeygetorder(key: Dbinterface): Observable<any> {
    return DbElasticService.executeInEs(
      'get',
      'figure/_doc/' + key.range,
      key,
    ).pipe(
      map((result: QueryinterfaceHitList) => {
        if (result._source.range) {
          return result._source;
        } else {
          let err = {
            code: '000005',
            message: 'server_error',
          };
          return err;
        }
      }),
      catchError((errr) => {
        let err = {
          code: '000005',
          message: 'server_error',
        };
        return of(err);
      }),
    );
  }

  /**
   * 根据任务结束时间查询任务
   */
  public static byOrderendTimeGetOrder(): Observable<any> {
    return DbElasticService.executeInEs('GET', 'figure/_search', {
      query: {
        range: {
          orderstartTime: {
            lt: 2613491205000,
            gte: 0,
          },
        },
      },
    }).pipe((data) => {
      return data;
    });
  }

  /**
   * 根据OrderEndTime查询order
   * @param from
   * @param size
   */
  public static byOrderEndTimeOrder(
    from: string,
    size: string,
  ): Observable<any> {
    return DbElasticService.executeInEs('GET', 'figure/_search', {
      query: {
        bool: {
          must: {
            exists: {
              field: 'orderendTime',
            },
          },
        },
      },
      from: from,
      size: size,
      sort: [
        {
          timestamp: {
            order: 'desc',
          },
        },
      ],
    }).pipe(
      map((result: Queryface) => {
        if (result._shards.successful == 1) {
          let newresult: commonqueryInterface = {
            list: [],
            maxsize: result.hits.total.value,
          };
          result.hits.hits.forEach((item, index) => {
            newresult.list.push(item['_source']);
          });
          return newresult;
        } else {
          let err = {
            code: '000005',
            message: 'server_error',
          };
          return err;
        }
      }),
      catchError((errr) => {
        let err = {
          code: '000005',
          message: ' ',
        };
        return of(err);
      }),
    );
  }
}
