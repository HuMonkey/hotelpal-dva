import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon } from 'antd';
import styles from './index.less';

import moment from 'moment';

import { Navs, MemberCard, CouponItem } from '../../components';
import { courseMemberCardUseful, liveMemberCardUseful, dispatchWechatShare } from '../../utils';

import emptyPng from '../../assets/coupon-empty.png';

class Coupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount () {
    const { dispatch } = this.props;
    const dict = {
      title: '酒店邦成长营',
      link: location.protocol + '//' + location.hostname,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    dispatchWechatShare(dict, dispatch);
  }

  render() {
    const { coupon } = this.props;

    const { card, liveVip } = coupon;

    if (!card || !liveVip) {
      return <div></div>
    }

    const couponList = coupon.couponList && coupon.couponList.filter(d => {
      const today = moment();
      return d.used === 'N' && today < moment(d.validity);
    })

    const noCoupon = !courseMemberCardUseful(card) && !liveMemberCardUseful(liveVip) 
      && couponList.length == 0;
    
    const hasUselessCoupon = (couponList.length !== coupon.couponList.length && coupon.couponList.length !== 0) // 有过期优惠券
      || (!courseMemberCardUseful(card) && card.existed === 'Y')
      || (!liveMemberCardUseful(liveVip) && liveVip.existed === 'Y');

    return (
      <div className={styles.normal}>
        <Navs/>
        {
          noCoupon && <div className={styles.empty}>
            <img className={styles.emptyPng} src={emptyPng} />
            <div className={styles.tips1}>没有优惠券</div>
            <div className={styles.tips2}>邀请好友获得优惠券哦！</div>
            <Link to={'/invite'}><div className={styles.btn}><Icon className={styles.icon} type="gift" />邀请得优惠券</div></Link>
          </div>
        }
        { 
          !noCoupon && <div className={styles.list}>
            { courseMemberCardUseful(card) && <MemberCard type={'course'} data={card} /> }
            { liveMemberCardUseful(liveVip) && <MemberCard type={'live'} data={liveVip} /> }
            {
              couponList.map((d, i) => {
                return <CouponItem key={i} data={d} />
              })
            }
          </div>
        }
        { hasUselessCoupon && <Link to={'/coupon/useless'}><div className={styles.tips3}>查看无效特权与优惠券<Icon type="right" /></div></Link> }
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
