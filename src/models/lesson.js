import * as lessonService from '../services/lesson';

export default {

  namespace: 'lesson',

  state: {
    detail: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname.indexOf('/lesson') === -1) {
            return false;
        }
        const lessonId = pathname.split('/')[3];
        dispatch({
          type: 'fetchLessonDetail',
          payload: {
            data: {
              id: lessonId,
            }
          }
        })
      });
    },
  },

  effects: {
    *fetchLessonDetail({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(lessonService.fetchLessonDetail, payload.data || {});
      if (res.data.code === 0) {
        const detail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            detail: detail
          },
        });
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
        detail: {}
      };
    }
  },

};
