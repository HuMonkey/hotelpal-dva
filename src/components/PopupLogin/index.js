import React, {Component} from 'react';
import { Link } from 'dva/router';
import isMobilePhone from 'validator/lib/isMobilePhone';
import styles from './index.less';

import { Icon, Input, message } from 'antd';

class PopupLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: null,
      vCode: null,

      disabled: false,
      btnText: null,
    };
  }

  phoneOnChange(ev) {
    if (!isMobilePhone(ev.target.value, 'zh-CN')) {
      this.setState({
        phone: ev.target.value,
        disabled: true,
      })
    } else {
      this.setState({
        phone: ev.target.value,
        disabled: false,
      })
    }
  }

  vCodeOnChange(ev) {
    this.setState({
      vCode: ev.target.value,
    })
  }

  async getVCode() {
    const { dispatch } = this.props;
    const { phone, disabled, btnText } = this.state;
    if (disabled || btnText !== null) {
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

  async submitVerify () {
    const { successCallback } = this.props;
    const phone = this.state.phone;
    const code = this.state.vCode;

    const { dispatch } = this.props;
    let result;
    await dispatch({
      type: 'common/verifyPhone',
      payload: {
        data: {
          phone, code,
        }
      },
      onResult (res) {
        result = res;
      }
    });
    if (result.data.code === 0) {
      message.success('注册成功~');
      successCallback();
    } else {
      message.error(result.data.messages || '绑定手机出错，请检查验证码是否正确');
    }
  }

  render() {
    const { closePopup, goback } = this.props;
    const { disabled, btnText } = this.state;

    const disabledClass = disabled ? ' ' + styles.disabled : '';

    return (
      <div className={styles.popupLogin}>
        <div className={styles.content}>
          { goback && <Icon type="left" size={`large`} className={styles.back} onClick={goback}/> }
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.title}>快捷登录</div>
            <div className={styles.wrap}>
              <Input type={`number`} onChange={this.phoneOnChange.bind(this)} className={styles.phone} placeholder={`请输入11位手机号`} />
              <Input type={`number`} onChange={this.vCodeOnChange.bind(this)} className={styles.vCode} placeholder={`请输入验证码`} />
              <div className={styles.getCodeBtn + disabledClass} onClick={this.getVCode.bind(this)}>{btnText || '获取验证码'}</div>
            </div>
            <div className={styles.tips}>点击[登录]代表您已阅读并同意<span>《酒店邦成长营会员条款》</span></div>
            <div className={styles.login} onClick={this.submitVerify.bind(this)}>登录</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupLogin;
