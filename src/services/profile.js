import request from '../utils/request';
import { config, getToken } from '../utils';

export function fetchStatics() {
  const jdbtk = getToken();
  return request(config.host + '/hotelpal/user/getUserStatistics?token=' + jdbtk);
}