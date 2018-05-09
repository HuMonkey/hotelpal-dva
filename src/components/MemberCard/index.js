import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import tickPng from '../../assets/coupon-tick.svg';
import tickedPng from '../../assets/coupon-ticked.svg';

class MemberCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, mode, selected } = this.props;
    let name = '学习卡';
    let left = `还有${3}次`;
    let expire = '2018-08-20';
    let vipClassName = '';
    if (type === 'live') {
      name = '公开课会员卡';
      left = '无限次';
      vipClassName = ' ' + styles.vip;
    }

    let topDom = <div>
      <div className={styles.icon}><span>{name}</span></div>
      <div className={styles.use}>去使用<span>{left}</span></div>
    </div>
    if (mode === 'select') {
      topDom = <div>
        <div className={styles.tips}>
          <span>免费</span>
          &nbsp;&nbsp;
          [{name}]
          &nbsp;
          {left}
        </div>
        { !selected && <img className={styles.check} src={tickPng} /> }
        { selected && <img className={styles.check} src={tickedPng} /> }
      </div>
    }

    return (
      <div className={styles.memberCard + vipClassName}>
        { topDom }
        <div className={styles.bottom}>
          <span className={styles.item}><div className={styles.logo}></div>所有订阅专栏可用</span>
          <span className={styles.item}><div className={styles.logo}></div>有效期至{expire}</span>
        </div>
      </div>
    )
  }
}

export default MemberCard;
