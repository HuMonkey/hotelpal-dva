import request from '../utils/request';
import { config } from '../utils';

export function receiveRedirect(data) {
  return request(config.host + '/hotelpal/WeChat/receiveRedirect?code=' + data.code)
}
