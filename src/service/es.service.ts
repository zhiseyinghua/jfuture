import { Observable, from, of, throwError } from 'rxjs';
import { Method } from 'src/common/db.elasticinterface';
import { switchMap, catchError } from 'rxjs/operators';
import axios, { AxiosRequestConfig } from 'axios';

// const axios = require('axios');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://localhost:9200/',
  log: 'trace',
});

/**
 * 这是一个请求负责处理
 */
export class DbElasticService {
  logg = 'DbElasticService';

  /**
   * 这是一个数据库服务 注意body传入的是一个
   * @param method 请求的Method，它是Metod类型
   * @param body   z'AA
   * @param url    请求的url
   */
  public static executeInEs(
    method: Method,
    urlstr: string,
    body?: any,
  ): Observable<any> {
    console.log(
      'DbElasticService' + ' executeInEs enter',
      method,
      body,
      urlstr,
    );
    let axiosData: AxiosRequestConfig = {
      method: method,
      url: 'http://localhost:9400/' + urlstr,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log('DbElasticService ' + 'executeInEs axiosData' + JSON.stringify(axiosData));
    return from(
      axios(axiosData),
    ).pipe(
      catchError((error) => {
        // console.log('DbElasticService ' + 'executeInEs' + error);
        // return throwError(error);
        return throwError(error);
      }),
      switchMap((result) => {
        // console.log(result);
        return of(result['data']);
      }),
    );
  }
}
