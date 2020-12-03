import { Observable, from, of, throwError } from 'rxjs';
import { Method } from 'src/common/db.elasticinterface';
import { switchMap, catchError } from 'rxjs/operators';
import axios from 'axios';

// const axios = require('axios');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://127.0.0.3:9200/',
  log: 'trace',
});

/**
 * 这是一个请求负责处理
 */
export class DbElasticService {
   logg = 'DbElasticService';

  /**
   * 这是一个数据库服务
   * @param method 请求的Method，它是Metod类型
   * @param body   请求的Body
   * @param url    请求的url
   * @param debug  是否测试
   */
  public static executeInEs(
    method: Method,
    bpdy: any,
    url: string,
  ): Observable<any> {
    console.log('DbElasticService' + ' executeInEs enter')
    return from(
      axios({
        method: 'post',
        url: 'http://127.0.0.3:9200/authtest/1',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone',
        },
        headers:{
            'Content-Type':'application/json'
        }
      }),
    ).pipe(
      catchError((error) => {
          console.log('DbElasticService ' + 'executeInEs'+error)
        // return throwError(error);
        return throwError(error);
      }),
      switchMap((result) => {
        console.log(result)
        return of(result['data']);
      }),
    );
  }
}
