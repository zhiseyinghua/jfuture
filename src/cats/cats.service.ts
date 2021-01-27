import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CatsService {
  static async abc(): Promise<any> {
    try {
      const response = await axios.get('http://localhost:9400/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response['data']);
      return response['data'];
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 跟上面用try catch 处理error
   */
  static async putdata(): Promise<any> {
    try {
      // url 端口为本机的9400 user代表索引 _doc为固定的字段不可更改  abc代表这个字段的唯一值 key
      // 他是一个put方法
      const response = await axios.put('http://localhost:9400/user/_doc/abc', {
        // 请求的headers
        headers: {
          'Content-Type': 'application/json',
        },
        // 请求的body
        data:{
          // 需要放进数据库的数据
          "abc":"abc"
        }
        
      });
      console.log(response['data']);
      return response['data'];
    } catch (error) {
      console.error(error);
    }
  }
}
