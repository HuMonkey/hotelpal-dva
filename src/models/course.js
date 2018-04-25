import * as courseService from '../services/course';

export default {

  namespace: 'course',

  state: {
    detail: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, search }) => {
        let courseId;
        if (pathname.indexOf('/course') > -1) {
          courseId = pathname.split('/')[2]
        }
        if (pathname.indexOf('/coursedetail') > -1) {
          courseId = search.split('=')[1]
        }
        if (!courseId) {
          return false;
        }
        dispatch({
          type: 'fetchCourseDetail',
          payload: {
            data: {
              id: courseId,
            }
          }
        })
      });
    },
  },

  effects: {
    *fetchCourseDetail({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(courseService.fetchCourseDetail, payload.data || {});
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
