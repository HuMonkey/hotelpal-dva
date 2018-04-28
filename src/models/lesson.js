import * as lessonService from '../services/lesson';
import * as courseService from '../services/course';

import { configWechat, updateWechartShare, getHtmlContent, getParam } from '../utils';

export default {

  namespace: 'lesson',

  state: {
    detail: null,
    courseDetail: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(async ({ pathname, search }) => {
        const inLesson = pathname.indexOf('/lesson') > -1;
        const inHongbao = pathname.indexOf('/hongbao') > -1;
        if (!inLesson && !inHongbao) {
            return false;
        }
        const lessonId = inLesson ? pathname.split('/')[3] : pathname.split('/')[2];
        const courseId = getParam('courseId');
        const fromHongbao = +getParam('fromHongbao');

        let course;
        if (courseId) {
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
          })
        }

        let detail;
        await dispatch({
          type: 'fetchLessonDetail',
          payload: {
            data: {
              id: lessonId,
            }
          },
          onResult (res) {
            detail = res;
          }
        });

        // 微信分享
        // 成长专栏、红包、未购买、正常
        let dict;
        if (inHongbao) {
          const nonce = getParam('nonce');
          let desc = getHtmlContent(detail.content);
          if (desc.length > 30) {
            desc = desc.slice(0, 30) + '...';
          }
          dict = {
            title: detail.userName + '：' + detail.title + '「红包分享」',
            link: `http://${location.origin}/?courseId=${courseId}&lessonId=${detail.id}#/hb/${nonce}`,
            imgUrl: course.headImg,
            desc
          }
        } else {
          // 酒店邦说
          if (!courseId) {
            let desc = getHtmlContent(detail.content);
            if (desc.length > 30) {
              desc = desc.slice(0, 30) + '...';
            }
            dict = {
              title: '成长专栏：' + detail.title,
              link: location.href,
              imgUrl: detail.coverImg,
              desc,
            }
          } else if (!course.purcharsed && !detail.freeListen && !fromHongbao) {
            dict = {
              title: course.userName + '：' + course.title,
              link: `http://${location.origin}/?courseId=${courseId}#/lesson/pay/${lessonId}`,
              imgUrl: course.headImg,
              desc: course.subtitle,
            }
          } else {
            let desc = getHtmlContent(detail.content);
            if (desc.length > 30) {
              desc = desc.slice(0, 30) + '...';
            }
            dict = {
              title: detail.userName + '：' + detail.title,
              link: `http://${location.origin}/?courseId=${courseId}#/lesson/pay/${lessonId}`,
              imgUrl: course.headImg,
              desc
            }
          }
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
        onResult(res.data.data)
      } else if (res.data.code === 40301) {
        yield put({
          type: 'save',
          payload: {
            detail: {
              paid: false,
            }
          },
        });
        onResult(null)
      }
    },
    *fetchCourseDetail({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(courseService.fetchCourseDetail, payload.data || {});
      if (res.data.code === 0) {
        const courseDetail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            courseDetail
          },
        });
        onResult(courseDetail);
      } else {
        onResult(null);
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
    *recordListenPos({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(lessonService.recordListenPos, payload.data || {});
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
