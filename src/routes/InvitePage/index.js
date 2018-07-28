import React, {Component} from 'react';
import { connect } from 'dva';
import { Link, withRouter } from 'dva/router';
import { Icon, Input, message } from 'antd';
import styles from './index.less';
import isMobilePhone from 'validator/lib/isMobilePhone';

import moneyIcon from '../../assets/invite-money.svg';
import couponEmpty from '../../assets/coupon-empty.png';
import { BackBtn, Navs } from '../../components';
import { getParam } from '../../utils';

class InvitePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null, // 获取成功 got 老用户 old 新用户 new
      phone: null,
      pwd: null,

      disabled: false,
      btnText: null,

      init: false,
    };
  }

  async register () {
    const { phone, pwd } = this.state;
    const { invitor } = this.props.common;

    const { dispatch } = this.props;
    let result;
    await dispatch({
      type: 'common/verifyPhone',
      payload: {
        data: {
          phone, code: pwd, inviterToken: invitor && invitor.wechatOpenId
        }
      },
      onResult (res) {
        result = res;
      }
    });
    if (result.data.code === 0) {
      this.setState({
        result: 'got'
      });
    } else {
      message.error(result.data.messages);
    }
  }

  componentDidUpdate () {
    const { common } = this.props;
    const { init } = this.state;
    if (init || !common.userInfo) {
      return false;
    }
    const oldUser = common.userInfo && common.userInfo.phone;
    if (oldUser) {
      this.setState({
        result: 'old',
        init: true,
      })
    } else {
      this.setState({
        result: 'new',
        init: true,
      })
    }
  }

  componentDidMount () {
    const { dispatch, location } = this.props;
    const invitor = getParam('invitor', location.search);
    // 获取邀请人用户信息
    dispatch({
      type: 'common/fetchUserInfo',
      payload: {
        token: invitor
      },
      onResult() {}
    });

    document.getElementsByTagName('html')[0].style.height = 'auto';
    document.getElementsByTagName('body')[0].style.height = 'auto';
  }

  componentWillUnmount() {
    document.getElementsByTagName('html')[0].style.height = '100%';
    document.getElementsByTagName('body')[0].style.height = '100%';
  }

  onChange (key, value) {
    let disabled = this.state.disabled;
    if (key === 'phone') {
      if (!isMobilePhone(value, 'zh-CN')) {
        disabled = true;
      } else {
        disabled = false;
      }
    }
    this.setState({
      [key]: value,
      disabled
    })
  }

  async getCode () {
    const { dispatch } = this.props;
    const { disabled, btnText, phone } = this.state;
    if (disabled || btnText !== null || !isMobilePhone(phone, 'zh-CN')) {
      return false;
    }
    let time = 60;
    this.setState({
      disabled: true,
      btnText: time + '秒'
    });
    let inter = setInterval(() => {
      time--;
      this.setState({
        btnText: time + '秒'
      });
      if (time === 0) {
        clearInterval(inter);
        const phone = this.state.phone;
        const disabled = !isMobilePhone(phone, 'zh-CN');
        this.setState({
          disabled,
          btnText: null,
        });
      }
    }, 1000);
    await dispatch({
      type: 'common/sendCaptcha',
      payload: {
        data: {
          phone
        }
      },
      onResult(res) {
        console.log(res)
      }
    })
  }

  render() {
    const { result, phone, pwd, disabled, btnText } = this.state;
    const { common } = this.props;
    const { invitor } = common;

    let rp = <div className={styles.rp}>
      <div className={styles.stitle}>优惠券</div>
      <div className={styles.price}><span>20</span>元</div>
      <div className={styles.tips}>所有订阅专栏可用</div>
    </div>

    const ucan = <div className={styles.ucan}>
      <div className={styles.label}>您可以</div>
      <Link to='/invite'><div className={styles.sbtn}>
        推荐好友得40元
        <img src={moneyIcon} className={styles.money} />
        <Icon className={styles.icon} type="right" />
      </div></Link>
      <BackBtn />
    </div>;

    // 获取成功
    const gotDom = <div className={styles.got}>
      <div>
        <div className={styles.text}>恭喜您！</div>
        <div className={styles.text}>获得一张优惠券</div>
      </div>
      { rp }
      <div className={styles.label1}>优惠券已经放入您的账号{common.userInfo && common.userInfo.phone}</div>
      { ucan }
    </div>;

    // 已经注册过
    const oldDom = <div className={styles.old}>
      <div className={styles.text}>您已经注册过了</div>
      { ucan }
    </div>;

    // 新用户
    const disabledClass = disabled ? ' ' + styles.disabled : '';
    const newDom = <div className={styles.new}>
      <div>
        <Icon className={styles.plus} type="plus" />
        <Icon className={styles.plus} type="plus" />
        <Icon className={styles.plus} type="plus" />
        <Icon className={styles.plus} type="plus" />
      </div>
      <div className={styles.inner1}><div className={styles.border} /></div>
      <div className={styles.inner2}>
        <div className={styles.border} />
      </div>
      {
        invitor && <div>
          <div className={styles.title}>
            <span>邀请函</span>
          </div>
          <div className={styles.text}>我是<span>{invitor.nickname}</span></div>
          <div className={styles.text}>正在<span>“酒店邦成长营”</span>学习</div>
          <div className={styles.text}>邀请你成为我的同学</div>
          <div className={styles.text + ' ' + styles.last}>让我们一起成长</div>
          <div className={styles.tips}>注册成新用户，即可得</div>
        </div>
      }
      { rp }
      <div className={styles.wrap1}>
        <Input type="number" onChange={(e) => {
          this.onChange.call(this, 'phone', e.target.value)
        }} value={phone} className={styles.input} placeholder="请输入11位手机号" size="large" />
      </div>
      <div className={styles.wrap2}>
        <Input type="number" onChange={(e) => {
          this.onChange.call(this, 'pwd', e.target.value)
        }} value={pwd} className={styles.input} placeholder="请输入验证码" size="large" />
        <div className={styles.code + disabledClass} onClick={this.getCode.bind(this)}>{btnText || '获取验证码'}</div>
      </div>
      <div className={styles.btn} onClick={this.register.bind(this)}>快捷注册</div>
      <div className={styles.tips2}>点击登录代表您已阅读并同意<span>《酒店邦成长营》会员条款</span></div>
      </div>;

    return <div className={styles.normal}>
      <Navs />
      { result === 'got' && gotDom }
      { result === 'old' && oldDom }
      { result === 'new' && newDom }
    </div>

  }
}

InvitePage.propTypes = {
};

const mapStateToProps = (state) => {
  return { invite: state.invite, common: state.common };
}

export default connect(mapStateToProps)(withRouter(InvitePage));
