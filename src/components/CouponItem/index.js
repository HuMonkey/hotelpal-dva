import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import tickPng from '../../assets/coupon-tick.svg';
import tickedPng from '../../assets/coupon-ticked.svg';

class CouponItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { mode, selected, border } = this.props;

    if (mode === 'select') {
      // TODO
    }

    const borderClassName = border ? ' ' + styles.border : '';

    return (
      <div className={styles.CouponItem + borderClassName}>
        <div className={styles.bg}>
          <div className={styles.money}>￥<span>20</span></div>
          <div className={styles.desc}>公开课红包</div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <div className={styles.tag}>订阅专栏</div>
            所有订阅课程满100可用
          </div>
          <div className={styles.expire}>有效期至2018-09-20</div>
          <div className={styles.tips}>满足使用条件</div>
          { mode !== 'select' && <div className={styles.btn}>去使用</div> }
          { 
            mode === 'select' && <div className={styles.check}>
              { selected && <img src={tickedPng} /> }
              { !selected && <img src={tickPng} /> }
            </div> 
          }
        </div>
      </div>
    )
  }
}

export default CouponItem;
