import * as indexService from '../services/index';

export default {

  namespace: 'index',

  state: {
    courseList: [],
    innerCourseList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        dispatch({
          type: 'fetchCourseList',
          payload: {},
        });
        dispatch({
          type: 'fetchInnerCourse',
          payload: {
            data: {
              start: 0,
              n: 4,
              order: 'desc',
            }
          },
        });
      });
    },
  },

  effects: {
    *fetchCourseList({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(indexService.fetchCourseList, payload.data || {});
      if (res.data.code === 0) {
        const courseList = res.data.data.courseList;
        yield put({
          type: 'save',
          payload: {
            courseList
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            courseList: [],
          },
        });
      }
    },
    *fetchInnerCourse({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(indexService.fetchInnerCourse, payload.data || {});
      if (res.data.code === 0) {
        const innerCourseList = res.data.data.lessonResponseList;
        yield put({
          type: 'save',
          payload: {
            innerCourseList
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            innerCourseList: [],
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
