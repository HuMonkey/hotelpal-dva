import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchCourseDetail(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/course/getCourse?courseId=' + data.id + '&token=' + jdbtk);
}