import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon } from 'antd';

class PopupOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { closePopup } = this.props;
    return (
      <div className={styles.PopupOrder}>
        <div className={styles.content}>
          <Icon type="left" size={`large`} className={styles.back} />
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.title}>订单确认</div>
            <div className={styles.box}>
              <div className={styles.avatar}></div>
              <div className={styles.infos}>
                <div className={styles.stitle}>一学就会的酒店营销课</div>
                <div className={styles.speaker}>李洋 feekr CEO</div>
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.row}>
                <div className={styles.left}>课程价格</div>
                <div className={styles.right}>￥199</div>
              </div>
              <div className={styles.row}>
                <div className={styles.left}>优惠</div>
                <div className={styles.right + ' ' + styles.coupon}>-￥20<Icon type="right" className={styles.chooseCoupons} /></div>
              </div>
            </div>
            <div className={styles.row + ' ' + styles.total}>
              <div className={styles.left}>合计</div>
              <div className={styles.right}>￥179</div>
            </div>
            <div className={styles.buy}>确认支付</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupOrder;
