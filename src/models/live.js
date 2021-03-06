import moment from 'moment';
import * as liveService from '../services/live';

import { getToken } from '../utils';

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

    watchingPeopleNum: 0,
    couponInfo: null,
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
            type: 'common/fetchUserInfo',
            payload: {
              token: invitor
            },
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
            type: 'fetchLiveDetail',
            payload: {
              data: {
                id: liveId
              }
            },
            onResult (res) {
              if (res.sysCouponId) {
                dispatch({
                  type: 'getSysCouponInfo',
                  payload: {
                    data: {
                      sysCouponId: res.sysCouponId
                    }
                  },
                  onResult() {}
                })
              }
              if (res.status !== 'ENROLLING') {
                inter && clearInterval(inter)
              }
            }
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
          // ws
          // const wsUri = `ws://t.hotelpal.cn:8081/live/chat`;
          let wsUri = `ws://hotelpal.cn/live/chat`;
          const protocol = location.protocol;
          if (protocol === 'https:') {
            wsUri = 'wss://hotelpal.cn/live/chat'
          }
          // websocket = new WebSocket(wsUri); 
          websocket = new ReconnectingWebSocket(wsUri); 
          websocket.onopen = function(evt) { 
            websocket.send(JSON.stringify({courseId: +liveId, token: getToken(), init:'Y'}))
          }; 
          websocket.onclose = function(evt) { 
            // message.error('socket 断开了');
            console.log('socket 断开了');
          }; 
          websocket.onmessage = async function(evt) {
            const data = JSON.parse(evt.data);
            if (data.msgType === 'TYPE_USER_MESSAGE') {
              // 评论
              dispatch({
                type: 'saveComment',
                payload: {
                  data: evt.data,
                }
              })
            } else if (data.msgType === 'TYPE_HIDE_COUPON') {
              // 隐藏红包
              dispatch({
                type: 'switchHb',
                payload: {
                  show: false,
                }
              })
            } else if (data.msgType === 'TYPE_LIVE_START') {
              window.location.reload();
            } else if (data.msgType === 'TYPE_SHOW_COUPON') {
              dispatch({
                type: 'switchHb',
                payload: {
                  show: true
                }
              })
            } else if (data.msgType === 'TYPE_IMAGE_CHANGE') {
              // 直播图片改变
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
            } else if (data.msgType === 'TYPE_ASSISTANT_MESSAGE_REMOVE') {
              dispatch({
                type: 'deleteAMsg',
                payload: {
                  data: evt.data,
                }
              })
            } else if (data.msgType === 'TYPE_LIVE_TERMINATE') {
              // 结束直播
              dispatch({
                type: 'fetchLiveDetail',
                payload: {
                  data: {
                    id: liveId
                  }
                },
                onResult (res) {}
              });
            } else if (data.msgType === 'TYPE_PRESENT_UPDATE') {
              // 观看直播人数的更新
              dispatch({
                type: 'save',
                payload: {
                  watchingPeopleNum: data.msg || 0
                }
              })
            }
          }; 
          websocket.onerror = function(evt) { 
            // message.error(JSON.stringify(evt));
          };

          dispatch({
            type: 'save',
            payload: {
              countDownInter: inter,
              invitor,
            }
          });
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
        chats.timeStamp = (new Date()).valueOf();
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
        onResult && onResult(res);
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
    *getCoupon({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.getCoupon, payload.data || {});
      if (res.data.code === 0) {
        onResult && onResult(res);
      } else {
        onResult && onResult(res);
      }
    },
    *createPayOrder({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(liveService.createPayOrder, payload.data || {});
      if (res.data.code === 0) {
        onResult && onResult(res);
      } else {
        onResult && onResult(res);
      }
    },
    *addComment({ payload, onResult }, { call, put }) {  // eslint-disable-line
      websocket.send(JSON.stringify({msg: payload.data.msg || '', courseId: payload.data.liveId, token: getToken()}))
      onResult && onResult();
    },
    * getSysCouponInfo({ payload: {data}, onResult }, { call, put }) {
      const result = yield call(liveService.getSysCouponInfo, data || {});
      const couponInfo = result.data.code === 0 ? result.data.data : null;
      yield put({
          type: 'save',
          payload: {
              couponInfo
          },
      });
  },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    switchHb(state, action) {
      return { ...state, hbShow: action.payload.show };
    },
    reset(state, action) {
      state.countDownInter && clearInterval(state.countDownInter);
      websocket && websocket.close();
      return {
        ...state,
        liveDetail: null,
        chats: [],
        countDownInter: null,
      };
    },
    saveAMsg(state, action) {
      const data = JSON.parse(action.payload.data && action.payload.data.trim());
      const assistantMsg = state.assistantMsg;
      return {...state, assistantMsg: [data, ...assistantMsg]};
    },
    deleteAMsg(state, action) {
      const data = JSON.parse(action.payload.data && action.payload.data.trim());
      const assistantMsg = state.assistantMsg;
      return {...state, assistantMsg: assistantMsg.filter(d => d.id !== data.id)};
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

      const newChats = [newComment, ...chats];
      chats.timeStamp = (new Date()).valueOf();
      return {...state, chats: newChats};
    },
  },

};
