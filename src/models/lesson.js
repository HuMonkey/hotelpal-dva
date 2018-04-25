import * as lessonService from '../services/lesson';
import * as courseService from '../services/course';

export default {

  namespace: 'lesson',

  state: {
    detail: null,
    courseDetail: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, search }) => {
        if (pathname.indexOf('/lesson') === -1) {
            return false;
        }
        const lessonId = pathname.split('/')[3];
        const courseId = search.split('=')[1];
        dispatch({
          type: 'fetchLessonDetail',
          payload: {
            data: {
              id: lessonId,
            }
          },
        });
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
      } else if (res.data.code === 40301) {
        yield put({
          type: 'save',
          payload: {
            detail: {
              paid: false,
            }
          },
        });
      }
    },
    *fetchCourseDetail({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(courseService.fetchCourseDetail, payload.data || {});
      if (res.data.code === 0) {
        const courseDetail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            courseDetail
          },
        });
      }
    },
    *submitComment({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(lessonService.submitComment, payload.data || {});
      onResult(res);
    },
    *addZan({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(lessonService.addZan, payload.data || {});
      onResult(res);
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    reset(state, action) {
      return {
        ...state,
        detail: null,
        courseDetail: null,
      };
    }
  },

};
