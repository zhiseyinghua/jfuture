import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as url from 'url';

const l = console.log;

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('events')
  onEvent(client: any, payload: any): Observable<any> {
    // this.server.emit('resmsg', data);  // io.emit('resmsg', payload)
    console.log('event');
    let  name = payload;
    // console.log(payload,name.ajanuw)
    if (name.ajanuw == 'ajanuw') {
      console.log('ajanuw')
      this.server.emit('addCart', 'Server AddCart Ok');
      // return of({
      //   event: 'events',
      //   data: {
      //     msg: 'hello ajanuw!',
      //   },
      // });
    }
    if (name === 'alone') {
      return of('hi', '实打实').pipe(
        map(($_) => ({
          event: 'events',
          data: {
            msg: $_,
          },
        })),
      );
    }
    return of(payload);
  }

  handleConnection(client: any) {
    // console.log(client)
    console.log('有人链接了' + client.id);
  }

  handleDisconnect(client: any) {}

  @SubscribeMessage('addCart')
  addCart(client: any, payload: any) {
    console.log(payload);
    console.log(url);
    var roomid = url.parse(client.request.url, true).query
      .roomid; /*获取房间号 获取桌号*/
      
    // console.log(url.parse);
    // console.log(client.request.url);
    console.log(url.parse(client.request.url, true).query);
    client.join(roomid);
    console.log('roomid',roomid);
    // console.log(client);
    this.server.to('roomid').emit('addCart', 'Server AddCart Ok'); //广播所有人包含自己
    // client.broadcast.to(roomid).emit('addCart', 'Server AddCart Ok'); //不包括自己
  }
}
