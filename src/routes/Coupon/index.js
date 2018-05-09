import React, {Component} from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

import { Navs, MemberCard, CouponItem, PopupCoupon } from '../../components';

import emptyPng from '../../assets/coupon-empty.png';

class Coupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.normal}>
        <Navs/>
        {
          false && <div className={styles.empty}>
            <img className={styles.emptyPng} src={emptyPng} />
            <div className={styles.tips1}>没有优惠券</div>
            <div className={styles.tips2}>邀请好友获得优惠券哦！</div>
            <div className={styles.btn}><Icon className={styles.icon} type="gift" />邀请</div>
          </div>
        }
        <div className={styles.list}>
          <MemberCard type={'course'} />
          <MemberCard type={'live'} />
          <CouponItem mode={`select`} selected={true}/>
          <PopupCoupon/>
        </div>
        <div className={styles.tips3}>查看无效特权与优惠券<Icon type="right" /></div>
      </div>
    );
  }
}

Coupon.propTypes = {
};

export default connect()(Coupon);
