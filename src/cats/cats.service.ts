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
}
