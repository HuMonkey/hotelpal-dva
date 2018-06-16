import request from '../utils/request';
import { config, getToken } from '../utils';

export function getLiveList() {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/live/courseList?token=' + jdbtk);
}

export function getLiveDetail(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/course?courseId=${data.id}&token=${jdbtk}`);
}

export function fetchChatHistory(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/chatList?courseId=${data.id}&currentPage=${data.currentPage}&pageSize=${data.pageSize}&order=desc&token=${jdbtk}`);
}

export function fetchAssistantMsgList(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/assistantMsgList?courseId=${data.id}&token=${jdbtk}`);
}

export function liveInviting(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/inviting?courseId=${data.id}&token=${jdbtk}`);
}

export function liveEnroll(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/enroll?courseId=${data.id}&token=${jdbtk}`);
}

export function enrollFor(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/enrollFor?courseId=${data.id}&inviter=${data.invitor}&token=${jdbtk}`);
}

export function getCoupon(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/getCoupon?courseId=${data.id}&token=${jdbtk}`);
}

export function createPayOrder(data) {
  const jdbtk = getToken();
  return request(`${config.host}/hotelpal/live/createPayOrder?courseId=${data.id}&token=${jdbtk}`);
}
