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

    const { type, domainId, used, validity, value, detail, name } = data;

    const expired = moment(validity).format('YYYY-MM-DD');

    if (mode === 'select') {
      // TODO
    }

    const borderClassName = border ? ' ' + styles.border : '';

    let tips1 = '', tips2 = '';
    const { apply, applyToCourseTitle, applyToPrice } = detail;
    const detailType = detail.type;
    if (apply === 'All') {
      tips1 = '所有订阅课程';
    } else if (apply === 'PARTICULAR') {
      tips2 = applyToCourseTitle;
    }

    if (applyToPrice > 0) {
      tips2 = `满${applyToPrice}`
    }

    return (
      <div className={styles.CouponItem + borderClassName}>
        <div className={styles.bg}>
          <div className={styles.money}>￥<span>{value}</span></div>
          <div className={styles.desc}>{name || '没名字的红包'}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            {detailType === 'COURSE' && <div className={styles.tag}>订阅专栏</div>}
            {tips1}{tips2}可用
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
