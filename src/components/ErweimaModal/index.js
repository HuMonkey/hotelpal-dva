import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import kefuPng from '../../assets/kefu.jpg';

import { Icon } from 'antd';

class ErweimaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onClose } = this.props;
    return (
      <div className={styles.erweimaModal}>
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.big}>关注酒店邦成长营</div>
            <div className={styles.small}>接收课程提醒&nbsp;随时回听回看</div>
          </div>
          <div className={styles.down}>
            <img src={kefuPng} />
            <div className={styles.btn}>长按识别二维码</div>
          </div>
        </div>
        <div className={styles.close} onClick={onClose}></div>
      </div>
    )
  }
}

export default ErweimaModal;
