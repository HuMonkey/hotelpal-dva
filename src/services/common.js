import request from '../utils/request';
import { config, getToken } from '../utils';

export function receiveRedirect(data) {
  return request(config.host + '/hotelpal/WeChat/receiveRedirect?code=' + data.code)
}

export function fetchUserInfo() {
  const jdbtk = getToken();
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
