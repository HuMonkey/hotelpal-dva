import * as lessonService from '../services/lesson';
import * as courseService from '../services/course';

export default {

  namespace: 'lesson',

  state: {
    detail: {},
    courseDetail: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname.indexOf('/lesson') === -1) {
            return false;
        }
        const isCourse = pathname.split('/')[2];
        const lessonId = pathname.split('/')[3];
        dispatch({
          type: 'fetchLessonDetail',
          payload: {
            data: {
              id: lessonId,
            }
          },
          onResult (res) {
            isCourse && dispatch({
              type: 'fetchCourseDetail',
              payload: {
                data: {
                  id: res.courseId,
                }
              }
            })
          }
        })
      });
    },
  },

  effects: {
    *fetchLessonDetail({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(lessonService.fetchLessonDetail, payload.data || {});
      if (res.data.code === 0) {
        const detail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            detail: detail
          },
        });
        onResult(detail);
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
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    reset(state, action) {
      return {
        ...state,
        detail: {},
        courseDetail: {},
      };
    }
  },

};
