import * as jdbsService from '../services/jdbs';

export default {

  namespace: 'jdbs',

  state: {
    courses: [],
    total: 0,
    hasMore: true,
    unListenedCount: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname != '/jdbs') {
            return false;
        }
      });
    },
  },

  effects: {
    *fetchCourseList({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(jdbsService.fetchCourseList, payload.data || {});
      if (res.data.code === 0) {
        const { lessonResponseList, hasMore, total, unListenedCount } = res.data.data;
        yield put({
          type: 'save',
          payload: {
            courses: payload.data.courses.concat(lessonResponseList), hasMore, total, unListenedCount
          },
        });
        onResult();
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    reset(state, action) {
      return {
        ...state,
        courses: [],
        total: 0,
        hasMore: true,
        unListenedCount: 0,
      };
    }
  },

};
