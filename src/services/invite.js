import request from '../utils/request';
import { config, getToken } from '../utils';

// const host = '/test';
const host = '';

export function fetchInviteRegList() {
  const jdbtk = getToken();
  return request(config.host + host + '/hotelpal/user/coupon/getInviteRegList?token=' + jdbtk);
}