import * as profileService from '../services/profile';

export default {

  namespace: 'profile',

  state: {
    statics: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname != '/profile') {
            return false;
        }
        dispatch({
          type: 'fetchStatics',
          payload: {},
        });
      });
    },
  },

  effects: {
    *fetchStatics({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(profileService.fetchStatics, payload.data || {});
      if (res.data.code === 0) {
        const statics = res.data.data;
        yield put({
          type: 'save',
          payload: {
            statics
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
