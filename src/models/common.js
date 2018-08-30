import * as commonService from '../services/common';
import { getParam, setCookie, getCookie, config, removeParam } from '../utils/';

import { message } from 'antd';

export default {

    namespace: 'common',

    state: {
        userInfo: null,
        invitor: null,
        couponInfo: null,
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
            const fetchUserInfo = function () {
                dispatch({
                    type: 'fetchUserInfo',
                    payload: {},
                })
            }
            return history.listen(async ({ pathname, query }) => {
                if (pathname === '/clear' || pathname === '/set') {
                    return false;
                }
                const code = getParam('code'); // url上的code
                const token = getCookie('jdbtk'); // cookie 里的jdbtk
                if (token) {
                    fetchUserInfo();
                    return false;
                }
                if (!code) {
                    const redirect = `http://hotelpal.cn/test.html?r=${location.href}`
                    // const redirect = location.href;
                    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
                        + config.appId + '&redirect_uri='
                        + encodeURIComponent(redirect)
                        + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                } else {
                    await dispatch({
                        type: 'receiveRedirect',
                        payload: {
                            code
                        },
                        onResult(res) {
                            if (res.data.code === 0) {
                                setCookie('jdbtk', res.data.data.token, '12d');
                                window.history.replaceState(null, null, removeParam('code'));
                                // fetchUserInfo();
                                location.reload();
                            } else {
                                message.error('微信认证失败，请刷新页面重试');
                            }
                        }
                    })
                }
            });
        },
    },

    effects: {
        * receiveRedirect({ payload: data, onResult }, { call, put }) {
            const result = yield call(commonService.receiveRedirect, data || {});
            onResult(result);
        },
        * fetchUserInfo({ payload: data, onResult }, { call, put }) {
            const result = yield call(commonService.fetchUserInfo, data || {});
            const userInfo = result.data.code === 0 ? result.data.data : {};
            if (data.token) {
                yield put({
                    type: 'save',
                    payload: {
                        invitor: userInfo
                    },
                });
                return false;
            }
            yield put({
                type: 'save',
                payload: {
                    userInfo
                },
            });
            onResult && onResult(userInfo)
        },
        * uploadAvatar({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.uploadAvatar, data || {});
            onResult(result)
        },
        * submitProfileChange({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.submitProfileChange, data || {});
            onResult(result)
        },
        * getWechatSign({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.getWechatSign, data || {});
            onResult(result)
        },
        * sendCaptcha({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.sendCaptcha, data || {});
            onResult(result)
        },
        * verifyPhone({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.verifyPhone, data || {});
            onResult(result)
        },
        * newInvitedUser({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.newInvitedUser, data || {});
            onResult(result)
        },
        * getSysCoupon({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.getSysCoupon, data || {});
            onResult(result)
        },
        * getSysCouponInfo({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.getSysCouponInfo, data || {});
            const couponInfo = result.data.code === 0 ? result.data.data : null;
            yield put({
                type: 'save',
                payload: {
                    couponInfo
                },
            });
        },
        * paySuccess({ payload: {data}, onResult }, { call, put }) {
            const result = yield call(commonService.paySuccess, data || {});
            onResult(result)
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
