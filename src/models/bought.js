import * as boughtService from '../services/bought';

export default {

  namespace: 'bought',

  state: {
    boughtList: []
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname != '/bought' && pathname != '/br') {
            return false;
        }
        dispatch({
          type: 'fetchBoughtList',
          payload: {},
        });
      });
    },
  },

  effects: {
    *fetchBoughtList({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(boughtService.fetchBoughtList, payload.data || {});
      if (res.data.code === 0) {
        const boughtList = res.data.data.courseList;
        yield put({
          type: 'save',
          payload: {
            boughtList
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            boughtList: [],
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
