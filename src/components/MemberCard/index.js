import React, {Component} from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import styles from './index.less';

import tickPng from '../../assets/coupon-tick.svg';
import tickedPng from '../../assets/coupon-ticked.svg';
import uselessTag from '../../assets/coupon-useless-tag.svg';

class MemberCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, mode, selected, data } = this.props;
    let name = '学习卡';
    let left = `还有${data.leftTimes || 0}次`;
    // let expire = '2018-08-20';
    let expire = moment(data.validity).format('YYYY-MM-DD');
    let vipClassName = '';
    if (type === 'live') {
      name = '公开课会员卡';
      left = '无限次';
      vipClassName = ' ' + styles.vip;
    }

    // 跳转链接
    const link = '/';

    let topDom = <div>
      <div className={styles.icon}><span>{name}</span></div>
      <div className={styles.use}><Link to={link}>去使用</Link><span>{left}</span></div>
    </div>

    // 判断是否过期
    const today = moment();
    const expired = today > moment(data.validity);
    if (expired) {
      topDom = <div>
        <div className={styles.icon}><span>{name}</span></div>
        <img src={uselessTag} className={styles.expire}/>
      </div>
    }

    // 如果是公开课会员，判断是否用完
    const empty = !data.leftTimes;
    if (type === 'course' && empty) {
      topDom = <div>
        <div className={styles.icon}><span>{name}</span></div>
        <div className={styles.empty}>次数已用完</div>
      </div>
    }

    // selece 模式
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

    const uselessClass = (expired || (type === 'course' && empty)) ? ' ' + styles.useless : '';
    return (
      <div className={styles.memberCard + vipClassName + uselessClass}>
        { topDom }
        <div className={styles.bottom}>
          <span className={styles.item}><div className={styles.logo}></div>{type === 'live' ? '所有直播公开课可用' : '所有订阅专栏可用'}</span>
          <span className={styles.item}><div className={styles.logo}></div>有效期至{expire}</span>
        </div>
      </div>
    )
  }
}

export default MemberCard;
