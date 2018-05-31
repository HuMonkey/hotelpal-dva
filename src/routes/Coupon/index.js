import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
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
    const { coupon } = this.props;

    const { card, couponList, liveVip } = coupon;

    if (!card || !liveVip) {
      return <div></div>
    }

    const noCoupon = card.exists === 'N' && liveVip.exists === 'N' && couponList.length == 0;
    // const noCoupon = true;

    return (
      <div className={styles.normal}>
        <Navs/>
        {
          noCoupon && <div className={styles.empty}>
            <img className={styles.emptyPng} src={emptyPng} />
            <div className={styles.tips1}>没有优惠券</div>
            <div className={styles.tips2}>邀请好友获得优惠券哦！</div>
            <Link to={'/invite'}><div className={styles.btn}><Icon className={styles.icon} type="gift" />邀请</div></Link>
          </div>
        }
        { 
          !noCoupon && <div className={styles.list}>
            { card.exists === 'Y' && <MemberCard type={'course'} data={card} /> }
            { liveVip.exists === 'Y' && <MemberCard type={'live'} data={liveVip} /> }
            {
              couponList.map((d, i) => {
                return <CouponItem key={i} data={d} />
              })
            }
            {/* <CouponItem /> */}
            { false && <PopupCoupon/> }
          </div>
        }
        <Link to={'/coupon/useless'}><div className={styles.tips3}>查看无效特权与优惠券<Icon type="right" /></div></Link>
      </div>
    );
  }
}

Coupon.propTypes = {
};

const mapStateToProps = (state) => {
  return { coupon: state.coupon, common: state.common };
}

export default connect(mapStateToProps)(Coupon);
