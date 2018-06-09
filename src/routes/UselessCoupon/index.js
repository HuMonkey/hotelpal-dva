import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import moment from 'moment';

import { Navs, MemberCard, CouponItem } from '../../components';

class UselessCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { coupon } = this.props;

    const { card, liveVip } = coupon;

    if (!card || !liveVip) {
      return <div></div>
    }

    const today = moment();
    const couponList = coupon.couponList && coupon.couponList.filter(d => {
      return today > moment(d.validity);
    })

    const courseMemberUseless = card.exists === 'Y' && (!card.leftTimes || today > moment(card.validity))
    const liveMemberUseless = liveVip.exists === 'Y' && (today > moment(liveVip.validity))

    const noCoupon = !couponList || couponList.length == 0;

    return (
      <div className={styles.normal}>
        <Navs/>
        {noCoupon && <div className={styles.empty}>暂无无效优惠券</div>}
        {
          !noCoupon && <div className={styles.list}>
            {
              courseMemberUseless && <MemberCard type={'course'} data={card} />
            }
            {
              liveMemberUseless && <MemberCard type={'live'} data={liveVip} />
            }
            {
              couponList.map((d, i) => {
                return <CouponItem key={i} data={d} />
              })
            }
          </div>
        }
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
