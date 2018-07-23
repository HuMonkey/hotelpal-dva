import React, {Component} from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import styles from './index.less';

import tickPng from '../../assets/coupon-tick.svg';
import tickedPng from '../../assets/coupon-ticked.svg';
import uselessTag from '../../assets/coupon-useless-tag.svg';
import usedTag from '../../assets/coupon-used.svg';

class CouponItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { mode, selected, border, data } = this.props;

    const { validity, value, detail, name, type, used } = data;

    const expired = moment(validity).format('YYYY-MM-DD');

    const today = moment();
    const useless = today > moment(validity) || used === 'Y';

    if (mode === 'select') {
      // TODO
    }

    const uselessClassName = useless ? ' ' + styles.useless : '';
    const borderClassName = border ? ' ' + styles.border : '';

    let tips1 = '', tips2 = '';
    const { apply, applyToCourseTitle, applyToPrice } = detail;
    if (apply === 'ALL') {
      tips1 = '所有订阅课程';
    } else if (apply === 'PARTICULAR') {
      tips1 = applyToCourseTitle.map(d => d).join('、');
    } else if (type === 'COURSE_REG_INVITE' || type === 'COURSE_REG') {
      tips1 = '所有订阅课程';
    }

    if (applyToPrice > 0) {
      tips2 = `满${applyToPrice}`
    }

    // 邀请注册红包
    if (type === 'COURSE_REG_INVITE' || type === 'COURSE_REG') {
      tips2 = `满${99}`
    }

    // 跳转链接
    const link = '/';

    return (
      <div className={styles.CouponItem + borderClassName + uselessClassName}>
        <div className={styles.bg}>
          <div className={styles.money}>￥<span>{value / 100}</span></div>
          {/* <div className={styles.desc}>{name}</div> */}
        </div>
        <div className={styles.right}>
          <div className={styles.top} title={name}>
            <div className={styles.tag}>订阅专栏</div>
            {/* {detailType === 'COURSE' && <div className={styles.tag}>订阅专栏</div>} */}
            <span>{name}</span>
          </div>
          <div className={styles.tips}>{tips1}{tips2}{(tips1 || tips2) && '可用'}</div>
          <div className={styles.expire}>有效期至{expired}</div>
          {/* { mode !== 'select' && <div className={styles.canuse}>满足使用条件</div> } */}
          { mode !== 'select' && !useless && <Link to={link}><div className={styles.btn}>去使用</div></Link> }
          { mode !== 'select' && useless && <img className={styles.expiredTag} src={data.used === 'Y' ? usedTag : uselessTag} /> }
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
