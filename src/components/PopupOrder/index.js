import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon } from 'antd';
import moment from 'moment';

import PopupCoupon from '../PopupCoupon/';
import { courseMemberCardUseful } from '../../utils';

class PopupOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponShow: false,

      maxDiscount: 0,
      couponSelected: null,
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

  componentDidMount () {
    const { coupon, course } = this.props;

    const price = (course.price || course.charge) / 100;

    const today = moment();
    const couponList = coupon.couponList && coupon.couponList.filter(d => {
      return today < moment(d.validity);
    })

    const card = coupon.card;
    const cardCanUse = courseMemberCardUseful(card);

    let couponSelected;
    let maxDiscount = 0;
    if (cardCanUse) {
      // 用会员卡
      maxDiscount = price;
      couponSelected = card;
      couponSelected.type = 'card';
    } else if (couponList) {
      // 优先用面额最大的优惠券
      const couponMoneys = couponList.map(d => d.value);
      maxDiscount = Math.max(...couponMoneys);
      couponSelected = couponList.find(d => d.value === maxDiscount);
    }
    this.setState({
      couponSelected, maxDiscount
    })
  }

  select (couponItem) {
    const { coupon, course } = this.props;
    const price = (course.price || course.charge) / 100;
    const card = coupon.card;

    let maxDiscount, couponSelected;
    if (couponItem === '不使用') {
      maxDiscount = 0;
      couponSelected = '不使用';
    } else {
      if (couponItem === 'card') {
        maxDiscount = price;
        couponSelected = card;
        couponSelected.type = 'card';
      } else {
        maxDiscount = couponItem.value;
        couponSelected = couponItem;
      }
    }

    this.setState({
      maxDiscount, couponSelected, couponShow: false,
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
    const cardCanUse = courseMemberCardUseful(card);

    const speaker = course.speaker || {
      nick: course.userName,
      company: course.company,
      title: course.userTitle,
    }

    const price = (course.price || course.charge) / 100;

    const { couponSelected, maxDiscount } = this.state;

    console.log(111, couponSelected, maxDiscount)

    return (
      <div className={styles.PopupOrder}>
        { couponShow && <PopupCoupon selectCallback={this.select.bind(this)} coupon={coupon} couponSelected={couponSelected} closePopup={this.closeCoupon.bind(this)}/>}
        { 
          !couponShow && <div className={styles.content}>
            {/* <Icon type="left" size={`large`} className={styles.back} onClick={closePopup}/> */}
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
                  {
                    couponSelected === '不使用' && <div className={styles.right + ' ' + styles.coupon} onClick={this.openCoupon.bind(this)}>不使用优惠<Icon type="right" className={styles.chooseCoupons} /></div>
                  }
                  { couponSelected !== '不使用' && (cardCanUse || couponList) && <div className={styles.right + ' ' + styles.coupon} onClick={this.openCoupon.bind(this)}>-￥{maxDiscount}<Icon type="right" className={styles.chooseCoupons} /></div>}
                  { !cardCanUse && !couponList && <div className={styles.right + ' ' + styles.coupon}>无可用优惠</div> }
                </div>
              </div>
              <div className={styles.row + ' ' + styles.total}>
                <div className={styles.left}>合计</div>
                <div className={styles.right}>￥{price - maxDiscount}</div>
              </div>
              <div className={styles.buy} onClick={this.createOrder.bind(this)}>确认支付</div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default PopupOrder;
