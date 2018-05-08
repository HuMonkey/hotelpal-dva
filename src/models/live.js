import moment from 'moment';
import * as liveService from '../services/live';

import { getToken } from '../utils';

export default {

  namespace: 'live',

  state: {
    list: [],
    liveDetail: null,
    assistantMsg: [],
    chats: [],
    now: moment(),
    countDownInter: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(async ({ pathname, search }) => {
        dispatch({
            type: 'fetchLiveList',
            payload: {},
            onResult (res) {}
        });
        if (pathname.indexOf('/live') > -1) {
          const liveId = pathname.split('/')[2];
          dispatch({
            type: 'fetchLiveDetail',
            payload: {
              data: {
                id: liveId
              }
            },
            onResult (res) {}
          });

          dispatch({
            type: 'fetchChatHistory',
            payload: {
              data: {
                id: liveId,
                currentPage: 1,
                pageSize: 60,
                order: 'desc',
              }
            },
            onResult (res) {}
          });
          dispatch({
            type: 'fetchAssistantMsgList',
            payload: {
              data: {
                id: liveId,
              }
            },
            onResult (res) {}
          });

          const inter = setInterval(() => {
            dispatch({
              type: 'save',
              payload: {
                now: moment(),
              }
            });
          }, 1000);

          dispatch({
            type: 'save',
            payload: {
              countDownInter: inter,
            }
          });

          // 讨论 ws
          const wsUri = `ws://t.hotelpal.cn:8080/hotelpal/live/chat/${getToken()}`;
          const websocket = new WebSocket(wsUri); 
          websocket.onopen = function(evt) { 
            console.log(evt) 
          }; 
          websocket.onclose = function(evt) { 
            console.log(evt) 
          }; 
          websocket.onmessage = function(evt) { 
            console.log(evt) 
          }; 
          websocket.onerror = function(evt) { 
            console.log(evt) 
          };
        }
      });
    },
  },

  effects: {
    *fetchLiveList({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.getLiveList, payload.data || {});
      if (res.data.code === 0) {
        const liveList = res.data.data;
        yield put({
          type: 'save',
          payload: {
            list: liveList
          },
        });
        onResult(liveList);
      } else {
        onResult(null);
      }
    },
    *fetchChatHistory({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.fetchChatHistory, payload.data || {});
      if (res.data.code === 0) {
        const chats = res.data.data;
        yield put({
          type: 'save',
          payload: {
            chats
          },
        });
        onResult(chats);
      } else {
        onResult(null);
      }
    },
    *fetchAssistantMsgList({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.fetchAssistantMsgList, payload.data || {});
      if (res.data.code === 0) {
        const assistantMsg = res.data.data;
        yield put({
          type: 'save',
          payload: {
            assistantMsg: assistantMsg.reverse()
          },
        });
        onResult(assistantMsg);
      } else {
        onResult(null);
      }
    },
    *fetchLiveDetail({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.getLiveDetail, payload.data || {});
      if (res.data.code === 0) {
        const liveDetail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            liveDetail
          },
        });
        onResult(liveDetail);
      } else {
        onResult(null);
      }
    },
    *liveInviting({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.liveInviting, payload.data || {});
      if (res.data.code === 0) {
        onResult(res);
      } else {
        onResult(null);
      }
    },
    *liveEnroll({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.liveEnroll, payload.data || {});
      if (res.data.code === 0) {
        onResult(res);
      } else {
        onResult(null);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
