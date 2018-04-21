import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchCourseList(data) {
  const jdbtk = getToken();
  // return request(config.host + '/hotelpal/lesson/getInternalLessonList?token=' + jdbtk);
  return request(`${config.host}/hotelpal/lesson/getInternalLessonList?start=${data.start}&n=${data.n}&order=${data.order}&token=${jdbtk}`);
}