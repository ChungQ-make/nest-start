import { WebSocket } from 'ws';

export interface CustomWebSocket extends WebSocket {
  id: number;
  [x: string]: any;
}

export interface MsgTypes {
  data: any;
  msg: string;
  event: string;
  broadcastList: number[];
  hasSelf?: boolean;
  selfId?: number;
  [x: string]: any;
}
