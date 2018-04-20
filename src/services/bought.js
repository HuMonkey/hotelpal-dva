import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchBoughtList() {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/getPaidCourseList?token=' + jdbtk);
}