import * as courseService from '../services/course';

import { configWechat, updateWechartShare, getHtmlContent, getParam } from '../utils';

export default {

  namespace: 'course',

  state: {
    detail: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(async ({ pathname, search }) => {
        let courseId;
        if (pathname.indexOf('/course') > -1) {
          courseId = pathname.split('/')[2]
        }
        if (pathname.indexOf('/coursedetail') > -1) {
          courseId = getParam('courseId');
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
        const dict = {
          title: course.userName + '：' + course.title,
          link: location.href,
          imgUrl: course.headImg,
          desc: course.subtitle,
        }
        await dispatch({
          type: 'common/getWechatSign',
          payload: {
            data: {
              url: location.href.split('#')[0]
            }
          },
          onResult (res) {
            if (res.data.code === 0) {
              const {appid, noncestr, sign, timestamp} = res.data.data;
              configWechat(appid, timestamp, noncestr, sign, () => {
                updateWechartShare(dict);
              });
            }
          }
        });
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
