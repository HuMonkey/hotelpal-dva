import * as lessonService from '../services/lesson';
import * as courseService from '../services/course';

import { message } from 'antd';

import {
  dispatchWechatShare,
  getHtmlContent,
  getParam
} from '../utils';

export default {

  namespace: 'lesson',

  state: {
    detail: null,
    courseDetail: null,
    nextDetail: null,
    commentsStart: 10,
    hasMore: true,
    commentList: [],
    replyToCommentList: [],
  },

  subscriptions: {
    setup({
      dispatch,
      history
    }) { // eslint-disable-line
      return history.listen(async ({
        pathname,
        search,
      }) => {
        const inLesson = pathname.indexOf('/lesson') > -1;
        const inHongbao = pathname.indexOf('/hongbao') > -1;
        if (!inLesson && !inHongbao) {
          return false;
        }
        const lessonId = inLesson ? pathname.split('/')[3] : pathname.split('/')[2];
        const courseId = getParam('courseId', search);
        const fromHongbao = +getParam('fromHongbao', search);

        let course;
        if (courseId) {
          await dispatch({
            type: 'fetchCourseDetail',
            payload: {
              data: {
                id: courseId,
              }
            },
            onResult(res) {
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
          onResult(res) {
            detail = res;
          }
        });

        // 微信分享
        // 成长专栏、红包、未购买、正常
        let dict;
        const protocol = location.protocol;
        if (inHongbao) {
          const nonce = getParam('nonce', search);
          let desc = getHtmlContent(detail.content);
          if (desc.length > 30) {
            desc = desc.slice(0, 30) + '...';
          }
          dict = {
            title: '「红包分享」' + course.userName + '：' + detail.title,
            link: `${location.origin}/hb/${nonce}?courseId=${courseId}&lessonId=${detail.id}`,
            imgUrl: protocol + course.headImg,
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
              imgUrl: protocol + detail.coverImg,
              desc,
            }
          } else if (!course.purchased && (!detail.freeListen) && !fromHongbao) {
            dict = {
              title: course.userName + '：' + course.title,
              link: `${location.origin}/lesson/pay/${lessonId}?courseId=${courseId}`,
              imgUrl: protocol + course.headImg,
              desc: course.subtitle,
            }
          } else {
            let desc = getHtmlContent(detail.content);
            if (desc.length > 30) {
              desc = desc.slice(0, 30) + '...';
            }
            dict = {
              title: course.userName + '：' + detail.title,
              link: `${location.origin}/lesson/pay/${lessonId}?courseId=${courseId}`,
              imgUrl: protocol + course.headImg,
              desc
            }
          }
        }
        const historyState = history.location.state;
        const ifAudioAutoPlay = historyState && (historyState.playing || historyState.goOn); 
        dispatchWechatShare(dict, dispatch, ifAudioAutoPlay);

      });
    },
  },

  effects: {
    * fetchLessonDetail({
      payload,
      onResult
    }, {
      call,
      put
    }) { // eslint-disable-line
      const res = yield call(lessonService.fetchLessonDetail, payload.data || {});
      if (res.data.code === 0) {
        const detail = res.data.data;
        const commentList = detail.commentList.commentList;
        const replyToCommentList = detail.commentList.replyToCommentList;
        const start = commentList.length;
        const hasMore = detail.commentList.hasMore;

        yield put({
          type: 'save',
          payload: {
            detail, commentsStart: start, hasMore, commentList, replyToCommentList
          },
        });
        onResult(res.data.data)
      } else if (res.data.code === 40301 || res.data.code === 4) {
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
    * fetchNextLessonDetail({
      payload,
      onResult
    }, {
      call,
      put
    }) { // eslint-disable-line
      const res = yield call(lessonService.fetchLessonDetail, payload.data || {});
      if (res.data.code === 0) {
        const detail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            nextDetail: detail
          },
        });
        onResult(res.data.data)
      }
    },
    * fetchCourseDetail({
      payload,
      onResult
    }, {
      call,
      put
    }) { // eslint-disable-line
      const res = yield call(courseService.fetchCourseDetail, payload.data || {});
      if (res.data.code === 0) {
        const courseDetail = res.data.data;
        yield put({
          type: 'save',
          payload: {
            courseDetail
          },
        });
        onResult && onResult(courseDetail);
      } else {
        onResult && onResult(null);
      }
    },
    * submitComment({
      payload,
      onResult
    }, {
      call,
      put
    }) { // eslint-disable-line
      const res = yield call(lessonService.submitComment, payload.data || {});
      onResult && onResult(res);
    },
    * fetchComments({
      payload,
      onResult
    }, {
      call,
      put
    }) { // eslint-disable-line
      const res = yield call(lessonService.fetchComments, payload.data || {});
      yield put({
        type: 'saveComments',
        payload: {
          data: res.data.data
        },
      });
      onResult && onResult();
    },
    * addZan({
      payload,
      onResult
    }, {
      call,
      put
    }) { // eslint-disable-line
      const res = yield call(lessonService.addZan, payload.data || {});
      const cid = payload.data.cid;
      yield put({
        type: 'updateZan',
        payload: {
          data: cid
        },
      });
      onResult && onResult(res);
    },
    * recordListenPos({
      payload,
      onResult
    }, {
      call,
      put
    }) { // eslint-disable-line
      const res = yield call(lessonService.recordListenPos, payload.data || {});
      onResult && onResult(res);
    },
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
    saveComments(state, action) {
      const commentList = state.commentList.slice(0).concat(action.payload.data.commentList || []);
      const replyToCommentList = state.replyToCommentList.slice(0).concat(action.payload.data.replyToCommentList || []);
      const hasMore = action.payload.data.hasMore;
      const commentsStart = commentList.length;
      return { 
        ...state, 
        commentList,
        replyToCommentList,
        hasMore,
        commentsStart
      };
    },
    updateZan(state, action) {
      const commentList = state.commentList.slice(0);
      const comment = commentList.find(d => d.id === action.payload.data);
      comment.liked = true;
      comment.zanCount++;
      return {
        ...state, commentList
      }
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
