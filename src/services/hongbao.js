import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchHongbaoDetail(data) {
  const jdbtk = getToken();
  // return request(config.host + '/hotelpal/lesson/getInternalLessonList?token=' + jdbtk);
  return request(`${config.host}/hotelpal/user/getRedPacketRemained?token=${jdbtk}&nonce=${data.nonce}`);
}

export function openRedPacket(data) {
  const jdbtk = getToken();
  // return request(config.host + '/hotelpal/lesson/getInternalLessonList?token=' + jdbtk);
  return request(`${config.host}/hotelpal/user/openRedPacket?token=${jdbtk}&nonce=${data.nonce}`);
}