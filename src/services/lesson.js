import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchLessonDetail(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/lesson/getLesson?lessonId=' + data.id + '&token=' + jdbtk);
}