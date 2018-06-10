import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchCoupons() {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/coupon/getUserCoupon?token=' + jdbtk);
}

export function getCoupon(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/coupon/collectCoupon?batch=' + data.batch + '&token=' + jdbtk);
}