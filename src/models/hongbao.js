import * as hongbaoService from '../services/hongbao';
import { getParam } from '../utils';

export default {

  namespace: 'hongbao',

  state: {
    detail: null,
    nonce: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, search }) => {
        if (pathname.indexOf('/hb') === -1) {
            return false;
        }
        const nonce = pathname.split('/')[2];
        const cid = getParam('courseId', search);
        const lid = getParam('lessonId', search);
        dispatch({
          type: 'fetchHongbaoDetail',
          payload: {
            data: {
              nonce
            }
          },
          onResult (res) {
            if (res.alreadyOpened) {
              history.push({
                pathname: `/lesson/pay/${lid}`,
                search: `?courseId=${cid}&fromHongbao=1`
              })
            }
          }
        });
        dispatch({
          type: 'save',
          payload: {
            nonce,
          }
        })
      });
    },
  },

  effects: {
    *fetchHongbaoDetail({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(hongbaoService.fetchHongbaoDetail, payload.data || {});
      if (res.data.code === 0) {
        const detail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            detail
          },
        });
        onResult(detail);
      } else {
        onResult(null);
      }
    },
    *openRedPacket({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(hongbaoService.openRedPacket, payload.data || {});
      onResult(res);
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },

};
