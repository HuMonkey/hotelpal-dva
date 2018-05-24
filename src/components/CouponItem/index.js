import React, {Component} from 'react';
import moment from 'moment';
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
    const { mode, selected, border, data } = this.props;

    const { type, domainId, used, validity, value } = data;

    const expired = moment(validity).format('YYYY-MM-DD');

    if (mode === 'select') {
      // TODO
    }

    const borderClassName = border ? ' ' + styles.border : '';

    return (
      <div className={styles.CouponItem + borderClassName}>
        <div className={styles.bg}>
          <div className={styles.money}>￥<span>20</span></div>
          <div className={styles.desc}>{type == 'COURSE' ? '公开课红包' : ''}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <div className={styles.tag}>订阅专栏</div>
            所有订阅课程满100可用
          </div>
          { mode !== 'select' && <div className={styles.blank}></div> }
          <div className={styles.expire}>有效期至{expired}</div>
          {/* <div className={styles.tips}>满足使用条件</div> */}
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
