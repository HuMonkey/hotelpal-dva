import * as couponService from '../services/coupon';

export default {

  namespace: 'coupon',

  state: {
    card: null, 
    couponList: [], 
    liveVip: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        if (pathname.indexOf('/course/') === -1 
          && pathname.indexOf('/coupon') === -1 
          && pathname != '/profile'
          && pathname.indexOf('/lesson/pay') === -1
        ) {
            return false;
        }
        dispatch({
          type: 'fetchCoupons',
          payload: {},
        });
      });
    },
  },

  effects: {
    *fetchCoupons({ payload }, { call, put }) {  // eslint-disable-line
      const res = yield call(couponService.fetchCoupons, payload.data || {});
      if (res.data.code === 0) {
        const { card, coupon, liveVip } = res.data.data;
        yield put({
          type: 'save',
          payload: {
            card, couponList: coupon, liveVip
          },
        });
      }
    },
    *getCoupon({ payload, onResult }, { call, put }) {  // eslint-disable-line
      const res = yield call(couponService.getCoupon, payload.data || {});
      if (res.data.code === 0) {
        onResult && onResult();
      } else {
        onResult && onResult();
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
