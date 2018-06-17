import request from '../utils/request';
import { config, getToken } from '../utils';

export function receiveRedirect(data) {
  return request(config.host + '/hotelpal/WeChat/receiveRedirect?code=' + data.code)
}

export function fetchUserInfo(data) {
  const jdbtk = data.token || getToken();
  return request(config.host + '/hotelpal/user/getUserInfo?token=' + jdbtk)
}

export function submitProfileChange(data) {
  let { avatar, nickname, company, title } = data;
  const jdbtk = getToken();
  let url = config.host + '/hotelpal/user/saveUserProp?token=' + jdbtk + '&headImg=' + avatar + '&nickname=' + nickname
  if (!company) {
    company = '';
  }
  url += '&company=' + company;
  if (!title) {
    title = '';
  }
  url += '&title=' + title;
  return request(url)
}

export function uploadAvatar(data) {
  return request(config.host + '/hotelpal/image/uploadImg', {
		method: 'POST',
		body: data
	});
}

export function getWechatSign(data) {
  // const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/getSign?url=' + encodeURIComponent(data.url))
}

export function sendCaptcha(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/sendCaptcha?token=' + jdbtk + '&phone=' + data.phone)
}

export function verifyPhone(data) {
  const jdbtk = getToken();
  let url = config.host + '/hotelpal/user/verifyPhone?token=' + jdbtk + '&phone=' + data.phone + '&code=' + data.code;
  if (data.inviterToken) {
    url += '&inviterToken=' + data.inviterToken;
  }
  return request(url)
}

export function newInvitedUser(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/newInvitedUser?token=' + jdbtk + '&nonce=' + data.nonce)
}

export function getSysCouponInfo(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/coupon/getSysCouponInfo?token=' + jdbtk + '&sysCouponId=' + data.sysCouponId)
}

export function getSysCoupon(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/coupon/getSysCoupon?token=' + jdbtk + '&nonce=' + data.nonce + '&sysCouponId=' + data.sysCouponId)
}
