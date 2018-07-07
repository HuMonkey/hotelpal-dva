import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon } from 'antd';
import moment from 'moment';

import MemberCard from '../MemberCard';
import CouponItem from '../CouponItem';
import { courseMemberCardUseful } from '../../utils';

import tickPng from '../../assets/coupon-tick.svg';
import tickedPng from '../../assets/coupon-ticked.svg';

class PopupCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { coupon, couponSelected, closePopup, selectCallback } = this.props;
    console.log(111, couponSelected);

    const today = moment();
    const couponList = coupon.couponList && coupon.couponList.filter(d => {
      return today < moment(d.validity);
    });

    const card = courseMemberCardUseful(coupon.card) ? coupon.card : null;

    const noUsePic = couponSelected === '不使用' ? tickedPng : tickPng;

    return (
      <div className={styles.PopupCoupon}>
        <div className={styles.content}>
          <Icon type="left" size={`large`} className={styles.back} onClick={closePopup} />
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.title}>选择优惠</div>
            <div className={styles.noUse} onClick={() => {
              selectCallback('不使用')
            }}>
              <div className={styles.label}>不使用优惠</div>
              <div className={styles.check}><img src={noUsePic} /></div>
            </div>
            <div className={styles.list}>
              { 
                card && <div onClick={() => {
                  selectCallback('card')
                }}>
                  <MemberCard type="course" mode={'select'} selected={couponSelected.type === 'card'} data={card}/> 
                </div>
              }
              {
                couponList.map((d, i) => {
                  const selected = d.id === (couponSelected && couponSelected.id);
                  return <div key={i} onClick={() => {
                    selectCallback(d)
                  }}><CouponItem border={true} mode={'select'} selected={selected} data={d}/></div>
                })
              }
              {/* <MemberCard mode={'select'} selected={false} data={{}}/>
              <CouponItem border={true} mode={'select'} selected={false} data={{}}/>
              <CouponItem border={true} mode={'select'} selected={false} data={{}}/>
              <CouponItem border={true} mode={'select'} selected={false} data={{}}/> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupCoupon;
