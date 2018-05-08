import request from '../utils/request';
import { config, getToken } from '../utils';

export function getLiveList() {
  const jdbtk = getToken();
  return request(config.host + '/test/hotelpal/live/courseList?token=' + jdbtk);
}

export function getLiveDetail(data) {
  const jdbtk = getToken();
  return request(`${config.host}/test/hotelpal/live/course?courseId=${data.id}&token=${jdbtk}`);
}

export function fetchChatHistory(data) {
  const jdbtk = getToken();
  return request(`${config.host}/test/hotelpal/live/chatList?courseId=${data.id}&currentPage=${data.currentPage}&pageSize=${data.pageSize}&order=desc&token=${jdbtk}`);
}

export function fetchAssistantMsgList(data) {
  const jdbtk = getToken();
  return request(`${config.host}/test/hotelpal/live/assistantMsgList?courseId=${data.id}&token=${jdbtk}`);
}

export function liveInviting(data) {
  const jdbtk = getToken();
  return request(`${config.host}/test/hotelpal/live/inviting?courseId=${data.id}&token=${jdbtk}`);
}

export function liveEnroll(data) {
  const jdbtk = getToken();
  return request(`${config.host}/test/hotelpal/live/enroll?courseId=${data.id}&token=${jdbtk}`);
}
