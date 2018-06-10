import moment from 'moment';
import * as liveService from '../services/live';

import { getToken, getParam } from '../utils';

import { message } from 'antd';

let websocket;

export default {

  namespace: 'live',

  state: {
    list: [],
    liveDetail: null,
    assistantMsg: [],
    chats: [],
    now: moment(),
    countDownInter: null,

    hbShow: false,
    PPTImg: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(async ({ pathname, search }) => {
        if (pathname.indexOf('/live') > -1) {
          const liveId = pathname.split('/')[2];
          const invitor = pathname.split('/')[4];
          dispatch({
            type: 'fetchLiveList',
            payload: {},
            onResult (res) {}
          });
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
              invitor,
            }
          });

          // 讨论 ws
          const wsUri = `ws://t.hotelpal.cn:8080/hotelpal/live/chat/${liveId}/${getToken()}`;
          console.log(wsUri)
          websocket = new WebSocket(wsUri); 
          websocket.onopen = function(evt) { 
            console.log(evt) 
          }; 
          websocket.onclose = function(evt) { 
            console.log(evt);
            message.error('socket 断开了');
          }; 
          websocket.onmessage = function(evt) {
            console.log(evt);
            const data = JSON.parse(evt.data);
            if (data.msgType === 'TYPE_USER_MESSAGE') {
              dispatch({
                type: 'saveComment',
                payload: {
                  data: evt.data,
                }
              })
            } else if (data.msgType === 'TYPE_HIDE_COUPON') {
              dispatch({
                type: 'switchHb',
                payload: {
                  show: false,
                }
              })
            } else if (data.msgType === 'TYPE_SHOW_COUPON') {
              dispatch({
                type: 'switchHb',
                payload: {
                  show: true
                }
              })
            } else if (data.msgType === 'TYPE_IMAGE_CHANGE') {
              dispatch({
                type: 'save',
                payload: {
                  PPTImg: data.msg
                }
              })
            } else if (data.msgType === 'TYPE_ASSISTANT_MESSAGE') {
              dispatch({
                type: 'saveAMsg',
                payload: {
                  data: evt.data,
                }
              })
            }
          }; 
          websocket.onerror = function(evt) { 
            console.log(evt) 
          };
        }
        if (pathname == '/') {
          dispatch({
            type: 'fetchLiveList',
            payload: {},
            onResult (res) {}
          });
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
        onResult && onResult(liveList);
      } else {
        onResult && onResult(null);
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
        onResult && onResult(chats);
      } else {
        onResult && onResult(null);
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
        onResult && onResult(assistantMsg);
      } else {
        onResult && onResult(null);
      }
    },
    *fetchLiveDetail({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.getLiveDetail, payload.data || {});
      if (res.data.code === 0) {
        const liveDetail = res.data.data;
        const currentImg = liveDetail.currentImg;
        yield put({
          type: 'save',
          payload: {
            liveDetail,
            PPTImg: currentImg
          },
        });
        onResult && onResult(liveDetail);
      } else {
        onResult && onResult(null);
      }
    },
    *liveInviting({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.liveInviting, payload.data || {});
      if (res.data.code === 0) {
        onResult && onResult(res);
      } else {
        onResult && onResult(null);
      }
    },
    *liveEnroll({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.liveEnroll, payload.data || {});
      if (res.data.code === 0) {
        onResult && onResult(res);
      } else {
        onResult && onResult(null);
      }
    },
    *enrollFor({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.enrollFor, payload.data || {});
      if (res.data.code === 0) {
        onResult && onResult(res);
      } else {
        onResult && onResult(res);
      }
    },
    *addComment({ payload, onResult }, { call, put }) {  // eslint-disable-line
      websocket.send(payload.data.msg || '');
      onResult && onResult();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    switchHb(state, action) {
      console.log(111, action.payload);
      return { ...state, hbShow: action.payload.show };
    },
    reset(state, action) {
      state.countDownInter && clearInterval(state.countDownInter);
      return {
        ...state,
        liveDetail: null,
        chats: [],
        countDownInter: null,
      };
    },
    saveAMsg(state, action) {
      const data = JSON.parse(action.payload.data && action.payload.data.trim());
      console.log(111, data);
      const assistantMsg = state.assistantMsg;
      return {...state, assistantMsg: [data, ...assistantMsg]};
    },
    saveComment(state, action) {
      const data = JSON.parse(action.payload.data && action.payload.data.trim());
      const chats = state.chats;

      const newComment = {
        blocked: data.blocked,
        createTime: data.createTime,
        updateTime: data.createTime,
        id: data.id,
        msg: data.msg,
        self: data.self,
        user: {
          company: data.company,
          headImg: data.headImg,
          nick: data.nick,
          title: data.title,
        }
      }

      // if (chats.some(d => d.id === newComment.id)) {
      //   return state;
      // }

      return {...state, chats: [newComment, ...chats]};
    },
  },

};
