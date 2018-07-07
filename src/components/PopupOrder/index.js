import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon, message } from 'antd';
import moment from 'moment';

import PopupCoupon from '../PopupCoupon/';
import { courseMemberCardUseful, strip } from '../../utils';

class PopupOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponShow: false,

      maxDiscount: 0,
      couponSelected: null,

      paying: false,
    };
  }

  async createOrder () {
    const { paying, couponSelected } = this.state;
    const { dispatch, course, paySuccessCallback } = this.props;
    if (paying) {
      return false;
    }
    await this.setState({
      paying: true,
    });
    if (couponSelected && couponSelected.type === 'card') {
      dispatch({
        type: 'course/getFreeCourse',
        payload: {
          data: {
            id: course.id,
          }
        },
        onResult: async (res) => {
          await this.setState({
            paying: false,
          });
          if (res.data.code === 0) {
            message.success('支付成功~');
            paySuccessCallback && paySuccessCallback()
          } else {
            message.error('支付出了点问题，请稍后再试~');
          }
        }
      })
    } else {
      const data = {
        id: course.id
      }
      if (couponSelected && couponSelected !== '不使用') {
        data.couponId = couponSelected.id;
      }
      dispatch({
        type: 'course/createPayOrder',
        payload: {
          data
        },
        onResult: async (res) => {
          await this.setState({
            paying: false,
          });
          if (res.data.code === 0) {
            if (res.data.data.purchased === 'Y') {
              paySuccessCallback && paySuccessCallback();
              return false;
            }
            const { appId, nonceStr, paySign, timeStamp, tradeNo } = res.data.data;
            wx.chooseWXPay({
              timestamp: timeStamp,
              appId: appId,
              nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
              package: res.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: paySign, // 支付签名
              success: (res) => {
                dispatch({
                  type: 'common/paySuccess',
                  payload: {
                    data: {
                      tradeNo,
                    }
                  },
                  onResult(res) {
                    message.success('支付成功~');
                    paySuccessCallback && paySuccessCallback()
                  }
                })
              },
              error: () => {
                message.error('支付出了点问题，请稍后再试~');
              }
            });
          } else {
            message.error('支付出了点问题，请稍后再试~');
          }
        }
      })
    }
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
    } else if (couponList.length > 0) {
      // 优先用面额最大的优惠券
      const couponMoneys = couponList.map(d => d.value);
      maxDiscount = Math.max(...couponMoneys) / 100 || 0;
      couponSelected = couponList.find(d => d.value === maxDiscount * 100);
    }
    console.log(222, couponSelected);
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
        maxDiscount = couponItem.value / 100;
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
    let couponList = coupon.couponList && coupon.couponList.filter(d => {
      return today < moment(d.validity);
    })

    const card = coupon.card;
    let cardCanUse = courseMemberCardUseful(card);

    const speaker = course.speaker || {
      nick: course.userName,
      company: course.company,
      title: course.userTitle,
    }

    const price = (course.price || course.charge) / 100;

    const { couponSelected, maxDiscount } = this.state;

    const total = price - maxDiscount > 0 ? strip(price - maxDiscount) : 0;

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
                    couponSelected === '不使用' && <div className={styles.right + ' ' + styles.coupon + ' ' + styles.notUsing} onClick={this.openCoupon.bind(this)}>不使用优惠<Icon type="right" className={styles.chooseCoupons} /></div>
                  }
                  { couponSelected !== '不使用' && (cardCanUse || (couponList && couponList.length > 0)) && <div className={styles.right + ' ' + styles.coupon} onClick={this.openCoupon.bind(this)}>-￥{maxDiscount}<Icon type="right" className={styles.chooseCoupons} /></div>}
                  { !cardCanUse && (!couponList || couponList.length === 0) && <div className={styles.right + ' ' + styles.coupon + ' ' + styles.empty}>无可用优惠</div> }
                </div>
              </div>
              <div className={styles.row + ' ' + styles.total}>
                <div className={styles.left}>合计</div>
                <div className={styles.right}>￥{total}</div>
              </div>
              <div className={styles.buy} onClick={this.createOrder.bind(this)}>{total === 0 ? `免费获取` : `确认支付`}</div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default PopupOrder;
