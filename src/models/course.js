import * as courseService from '../services/course';

import { dispatchWechatShare, getParam } from '../utils';

import { message } from 'antd';

export default {

  namespace: 'course',

  state: {
    detail: {},
    recommendCourse: null
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(async ({ pathname, search }) => {
        let courseId;
        if (pathname.indexOf('/course') > -1) {
          courseId = pathname.split('/')[2]
        }
        if (pathname.indexOf('/coursedetail') > -1) {
          courseId = getParam('courseId', search);
        }
        if (!courseId) {
          return false;
        }
        let course;
        await dispatch({
          type: 'fetchCourseDetail',
          payload: {
            data: {
              id: courseId,
            }
          },
          onResult (res) {
            course = res;
          }
        });
        const protocol = location.protocol;
        const dict = {
          title: course.userName + '：' + course.title,
          link: `${location.origin}/course/${courseId}`,
          imgUrl: protocol + course.headImg,
          desc: course.subtitle,
        }
        dispatchWechatShare(dict, dispatch);
      });
    },
  },

  effects: {
    *fetchCourseDetail({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(courseService.fetchCourseDetail, payload.data || {});
      if (res.data.code === 0) {
        const detail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            detail: detail
          },
        });
        onResult(detail);
      } else {
        onResult(null)
      }
    },
    *getFreeCourse({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(courseService.getFreeCourse, payload.data || {});
      onResult(res);
    },
    *createPayOrder({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(courseService.createPayOrder, payload.data || {});
      onResult(res);
    },
    *getRecommendCourse({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(courseService.getRecommendCourse, payload.data || {});
      const detail = res.data;
      yield put({
        type: 'save',
        payload: {
          recommendCourse: detail
        },
      });
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
        detail: {}
      };
    }
  },

};
