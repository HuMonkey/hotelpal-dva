import * as commonService from '../services/common';
import { getParam, setCookie, getCookie, config } from '../utils/';

export default {

    namespace: 'common',

    state: {
        userInfo: null,
        invitor: null,
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
                const code = getParam('code'); // url上的code
                const token = getCookie('jdbtk'); // cookie 里的jdbtk
                if (token) {
                    fetchUserInfo();
                    return false;
                }
                if (!code) {
                    const origin = encodeURIComponent(location.origin);
                    const search = encodeURIComponent(location.search);
                    const hash = encodeURIComponent(location.hash);
                    const redirect = `http://hotelpal.cn/test.html?origin=${origin}&search=${search}&hash=${hash}`
                    // const redirect = `http://hotelpal.cn`
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
                                window.history.pushState(null, null, location.pathname + location.hash);
                                // fetchUserInfo();
                                location.reload();
                            } else {
                                alert('微信认证失败，请刷新页面重试');
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
        * fetchUserInfo({ payload: data }, { call, put }) {
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
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
