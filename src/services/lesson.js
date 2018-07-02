import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchLessonDetail(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/lesson/getLesson?lessonId=' + data.id + '&token=' + jdbtk);
}

export function submitComment(data) {
  const jdbtk = getToken();
  let url = config.host + '/hotelpal/user/newComment' + '?token=' + jdbtk + '&lessonId=' + data.lessonId + '&comment=' + encodeURIComponent(data.comment);
  if (data.replyToCommentId) {
    url += '&replyToCommentId=' + data.replyToCommentId
  }
  return request(url);
}
export function addZan(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/addZan?commentId=' + data.cid + '&lessonId=' + data.lid + '&token=' + jdbtk);
}
export function recordListenPos(data) {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/recordListenPos?lessonId=' + data.lid + '&recordPos=' + data.pos + '&token=' + jdbtk);
}