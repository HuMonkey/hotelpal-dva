import * as inviteService from '../services/invite';

export default {

  namespace: 'invite',

  state: {
    totalCoupon: 0, 
    inviteList: [
      { batch: 1, CouponCollected: 'N', userList: [{ headImg: 'https://worldcup-resource.oss-cn-hangzhou.aliyuncs.com/team/%E5%BE%B7%E5%9B%BD.png' }] },
      { batch: 2, CouponCollected: 'N', userList: [{ headImg: 'https://worldcup-resource.oss-cn-hangzhou.aliyuncs.com/team/%E5%BE%B7%E5%9B%BD.png' }] },
      { batch: 3, CouponCollected: 'N', userList: [{ headImg: 'https://worldcup-resource.oss-cn-hangzhou.aliyuncs.com/team/%E5%BE%B7%E5%9B%BD.png' }] },
    ]
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname != '/invite') {
            return false;
        }
        dispatch({
          type: 'fetchInviteRegList',
          payload: {},
        });
      });
    },
  },

  effects: {
    *fetchInviteRegList({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(inviteService.fetchInviteRegList, payload.data || {});
      if (res.data.code === 0) {
        const { totalCoupon, inviteList } = res.data.data;
        yield put({
          type: 'save',
          payload: {
            totalCoupon, 
            // inviteList,
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
        statics: {},
      };
    }
  },
};
