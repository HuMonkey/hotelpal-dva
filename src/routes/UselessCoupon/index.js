import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { Navs, MemberCard, CouponItem } from '../../components';

class UselessCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { coupon } = this.props;

    const { card, couponList, liveVip } = coupon;

    if (!card || !liveVip) {
      return <div></div>
    }

    return (
      <div className={styles.normal}>
        <Navs/>
        无效优惠券
      </div>
    );
  }
}

UselessCoupon.propTypes = {
};

const mapStateToProps = (state) => {
  return { coupon: state.coupon, common: state.common };
}

export default connect(mapStateToProps)(UselessCoupon);
