import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchInviteRegList() {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/coupon/getInviteRegList?token=' + jdbtk);
}