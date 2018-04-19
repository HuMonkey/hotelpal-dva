import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchCourseList() {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/course/getCourseList?token=' + jdbtk);
}

export function fetchInnerCourse({start, n, order}) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/lesson/getInternalLessonList?token=${jdbtk}&start=${start}&n=${n}&order=${order}`);
}
