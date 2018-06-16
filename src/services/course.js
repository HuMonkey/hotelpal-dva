import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchCourseDetail(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/course/getCourse?courseId=' + data.id + '&token=' + jdbtk);
}

export function getFreeCourse(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/getFreeCourse?courseId=' + data.id + '&token=' + jdbtk);
}

export function createPayOrder(data) {
  const jdbtk = getToken();
  let url = config.host + '/hotelpal/user/createPayOrder?courseId=' + data.id + '&token=' + jdbtk;
  if (data.couponId) {
    url += '&couponId=' + data.couponId
  }
  return request(url);
}