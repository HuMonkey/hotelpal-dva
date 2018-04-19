import * as commonService from '../services/common';
import { getParam, setCookie, getCookie, config } from '../utils/';

export default {

    namespace: 'common',

    state: {},

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
            return history.listen(({ pathname, query }) => {
                const code = getParam('code'); // url上的code
                const token = getCookie('jdbtk'); // cookie 里的jdbtk
                if (token) {
                    return false;
                }
                if (!code) {
                    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
                        + config.appId + '&redirect_uri=' 
                        + encodeURIComponent(location.href) 
                        +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
                } else {
                    dispatch({
                        type: 'receiveRedirect',
                        payload: {
                            code
                        },
                        onResult(res) {
                            if (res.data.code === 0) {
                                setCookie('jdbtk', res.data.data.token, '12d');
                                window.history.pushState(null, null, location.pathname + location.hash);
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
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
