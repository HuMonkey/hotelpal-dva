import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon, Input } from 'antd';

class PopupLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { closePopup } = this.props;

    return (
      <div className={styles.popupLogin}>
        <div className={styles.content}>
          <Icon type="left" size={`large`} className={styles.back} />
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.title}>快捷登录</div>
            <div className={styles.wrap}>
              <Input className={styles.phone} placeholder={`请输入11位手机号`} />
              <Input className={styles.vCode} placeholder={`请输入验证码`} />
            </div>
            <div className={styles.tips}>点击[登录]代表您已阅读并同意<span>《酒店邦成长营会员条款》</span></div>
            <div className={styles.login}>登录</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupLogin;
