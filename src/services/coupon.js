import request from '../utils/request';
import { config, getToken } from '../utils';

const host = '/test';
// const host = '';

export function fetchCoupons() {
  const jdbtk = getToken();
  return request(config.host + host + '/hotelpal/user/coupon/getUserCoupon?token=' + jdbtk);
}

export function getCoupon(data) {
  const jdbtk = getToken();
  return request(config.host + host + '/hotelpal/user/coupon/collectCoupon?batch=' + data.batch + '&token=' + jdbtk);
}