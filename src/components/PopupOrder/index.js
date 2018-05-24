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
    const { closePopup, course } = this.props;
    console.log(222, course);
    return (
      <div className={styles.PopupOrder}>
        <div className={styles.content}>
          <Icon type="left" size={`large`} className={styles.back} />
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.title}>订单确认</div>
            <div className={styles.box}>
              <div className={styles.avatar} style={{ backgroundImage: `url(${course.bannerImg})` }}></div>
              <div className={styles.infos}>
                <div className={styles.stitle}>{course.title}</div>
                <div className={styles.speaker}>{course.speaker.nick} {course.speaker.company} {course.speaker.title}</div>
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.row}>
                <div className={styles.left}>课程价格</div>
                <div className={styles.right}>￥{course.price / 100}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.left}>优惠</div>
                {/* <div className={styles.right + ' ' + styles.coupon}>-￥20<Icon type="right" className={styles.chooseCoupons} /></div> */}
                <div className={styles.right + ' ' + styles.coupon}>无可用优惠</div>
              </div>
            </div>
            <div className={styles.row + ' ' + styles.total}>
              <div className={styles.left}>合计</div>
              <div className={styles.right}>￥{course.price / 100}</div>
            </div>
            <div className={styles.buy}>确认支付</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupOrder;
