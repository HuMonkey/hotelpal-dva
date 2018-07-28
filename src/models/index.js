import * as indexService from '../services/index';

export default {

  namespace: 'index',

  state: {
    courseList: [],
    innerCourseList: [],
    bannerList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname != '/') {
          return false;
        }
        dispatch({
          type: 'fetchCourseList',
          payload: {},
        });
        dispatch({
          type: 'fetchBanner',
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
    *fetchBanner({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(indexService.fetchBanner, payload.data || {});
      if (res.data.code === 0) {
        const bannerList = res.data.data.list;
        yield put({
          type: 'save',
          payload: {
            bannerList
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            bannerList: [],
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
