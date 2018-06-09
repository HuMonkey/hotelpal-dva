import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon } from 'antd';
import moment from 'moment';

import PopupCoupon from '../PopupCoupon/';

class PopupOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponShow: false,
    };
  }

  createOrder () {
    const { dispatch } = this.props;
    // TODO
    alert('进入支付！');
  }

  openCoupon () {
    this.setState({
      couponShow: true,
    })
  }

  closeCoupon () {
    this.setState({
      couponShow: false,
    })
  }

  render() {
    const { couponShow } = this.state;
    const { closePopup, course, coupon } = this.props;

    const today = moment();
    const couponList = coupon.couponList && coupon.couponList.filter(d => {
      return today < moment(d.validity);
    })

    const card = coupon.card;
    const cardCanUse = card.exists === 'Y' && card.leftTimes > 0 && moment(card.validity) > today;

    const speaker = course.speaker || {
      nick: course.userName,
      company: course.company,
      title: course.userTitle,
    }

    const price = (course.price || course.charge) / 100;

    let maxDiscount = 0;
    if (cardCanUse) {
      maxDiscount = price;
    } else if (couponList) {
      const couponMoneys = couponList.map(d => d.value);
      console.log(couponMoneys);
      maxDiscount = Math.max(...couponMoneys);
    }

    return (
      <div className={styles.PopupOrder}>
        { couponShow && <PopupCoupon closePopup={this.closeCoupon.bind(this)}/>}
        <div className={styles.content}>
          <Icon type="left" size={`large`} className={styles.back} />
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.title}>订单确认</div>
            <div className={styles.box}>
              <div className={styles.avatar} style={{ backgroundImage: `url(${course.bannerImg})` }}></div>
              <div className={styles.infos}>
                <div className={styles.stitle}>{course.title}</div>
                <div className={styles.speaker}>{speaker.nick} {speaker.company} {speaker.title}</div>
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.row}>
                <div className={styles.left}>课程价格</div>
                <div className={styles.right}>￥{price}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.left}>优惠</div>
                { (cardCanUse || couponList) && <div className={styles.right + ' ' + styles.coupon}>-￥{maxDiscount}<Icon type="right" className={styles.chooseCoupons} /></div>}
                { !cardCanUse && !couponList && <div className={styles.right + ' ' + styles.coupon} onClick={this.openCoupon.bind(this)}>无可用优惠</div> }
              </div>
            </div>
            <div className={styles.row + ' ' + styles.total}>
              <div className={styles.left}>合计</div>
              <div className={styles.right}>￥{price - maxDiscount}</div>
            </div>
            <div className={styles.buy} onClick={this.createOrder.bind(this)}>确认支付</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupOrder;
