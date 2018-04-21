import request from '../utils/request';
import { config, getToken } from '../utils';

export function receiveRedirect(data) {
  return request(config.host + '/hotelpal/WeChat/receiveRedirect?code=' + data.code)
}

export function fetchUserInfo() {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/getUserInfo?token=' + jdbtk)
}
