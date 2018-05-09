import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon } from 'antd';

import { MemberCard, CouponItem } from '../index';

import tickPng from '../../assets/coupon-tick.svg';
import tickedPng from '../../assets/coupon-ticked.svg';

class PopupCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { closePopup } = this.props;
    return (
      <div className={styles.PopupCoupon}>
        <div className={styles.content}>
          <Icon type="left" size={`large`} className={styles.back} />
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.title}>选择优惠</div>
            <div className={styles.noUse}>
              <div className={styles.label}>不使用优惠</div>
              <div className={styles.check}><img src={tickPng} /></div>
            </div>
            <div className={styles.list}>
              <MemberCard mode={'select'} selected={false}/>
              <CouponItem border={true} mode={'select'} selected={false}/>
              <CouponItem border={true} mode={'select'} selected={false}/>
              <CouponItem border={true} mode={'select'} selected={false}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupCoupon;
