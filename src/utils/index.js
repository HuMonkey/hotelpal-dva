import request from './request';

/**
 * 判断userAgent的一些方法
 */
const userAgent = navigator.userAgent.toLowerCase();
const ua = {
    wechat: userAgent.indexOf('micromessenger') > -1, // 判断是否在微信里
    xinhuashe: userAgent.indexOf('xyapp') > -1, // 判断是否在新华社app里
    iOS: userAgent.indexOf('iphone') > -1, // 判断是否在ios里
    weibo: userAgent.match(/WeiBo/i) == 'weibo', // 判断是否在ios里
    iPhone: userAgent.indexOf('iphone') > -1, // 判断是否在iphone里
    android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('android') > -1 || userAgent.indexOf('Adr') > -1, // 判断是否在android里
};

// 判断是否登录
const isLogin = function () {
    return true;
}
 
const config = {
    host: 'http://hotelpal.cn/api', // 线上
    appId: 'wxfe666ebbf0e42897'
}

const setCookie = function (key, value, extime) {
    let extimeExt = extime.substr(-1);
    let extimeInt = parseInt(extime);
    let extimeSec = {
        "s": 1000,
        "m": 60 * 1000,
        "h": 3600 * 1000,
        "d": 24 * 3600 * 1000
    };
    if (!extimeSec[extimeExt]) extimeExt = 's';
    let sec = extimeInt * extimeSec[extimeExt];
    let exp = new Date();
    exp.setTime(exp.getTime() + sec);
    document.cookie = key + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
}

const getCookie = function (key) {
    const cookie_val = document.cookie.match(
        new RegExp('(?:^|;)\\s*' + key + '=([^;]+)')
    );
    return cookie_val ? unescape(cookie_val[1]) : '';
}

/**
 * 计算一段文字的长度
 */
const textLength = function (para, fontSize) {
    if (!para || !fontSize) {
        return 0;
    }
    para = util.getHtmlContent(para);
    let length = 0;
    for (var i = 0; i < para.length; i++) {
        const ch = para[i];
        if (ch >= 'A' && ch <= 'Z') {
            length += fontSize * 2 / 3;
        } else if (ch >= 'a' && ch <= 'z') {
            length += fontSize / 2;
        } else if (ch >= '0' && ch <= '9') {
            length += fontSize / 2;
        } else if (ch === ',' && ch === ':' && ch === '.' && ch === '?' && ch === '!'
            && ch === '\'' && ch === '"') {
            length += fontSize / 2;
        } else {
            length += fontSize;
        }
    }
    return length;
}

/**
 * 数字前面补0
 */
const formatNum = function (num) {
    return num > 9 ? num : '0' + num;
}

/**
 * 格式化时间戳
 */
const formatTime = function (time) {
    if (!time) {
        return null;
    }
    var date = new Date(time.replace(/\-/g, "/"));
    var now = new Date();
    var diff = now.getTime() - date.getTime();
    var M_DAY = 24 * 60 * 60 * 1000;
    var M_HOUR = 60 * 60 * 1000;
    var days = Math.floor(diff / M_DAY)
    diff = diff - days * M_DAY;
    var hours = Math.floor(diff / M_HOUR)
    diff = diff - hours * M_HOUR;
    var minutes = Math.floor(diff / 60 / 1000);
    var result;
    if (days > 0) {
        if (days > 30) {
            var month = Math.floor(days / 30)
            result = `${month}个月前`
        } else {
            result = `${days}天前`
        }
    } else if (hours > 0) {
        result = `${hours}小时前`
    } else if (minutes > 0) {
        result = `${minutes}分钟前`
    } else {
        result = '刚刚'
    }
    return result;
}

const getHtmlContent = function (str) {
    return str.replace(/<style(.|\n)*\/style>/g, "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
}

/**
 * 获取url里的参数
 */
const getParam = function (name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
}

const removeParam = function (key) {
    const sourceURL = location.href.split('#')[0];
    const hash = location.href.split('#')[1];
    let rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (let i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    if (hash) {
        rtn = rtn + "#" + hash;
    }
    return rtn;
}

const getToken = function () {
    return getCookie('jdbtk');
}

export {
    ua, isLogin, config,
    setCookie, getCookie, getParam,
    textLength, getHtmlContent,
    formatNum, formatTime,
    getToken,
}