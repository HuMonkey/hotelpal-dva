import React, {Component} from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

import { Navs } from '../../components';

import hbBg from '../../assets/invite-hb.png';

class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.normal}>
        <Navs/>
        <img src={hbBg} className={styles.bg} />
        <div className={styles.title}>送好友<span>20</span>元优惠券</div>
        <div className={styles.stitle}>每三个好友注册后你也能获得20元优惠券</div>
        <div className={styles.goto}>活动规则<Icon className={styles.icon} type="right" /></div>
        <div className={styles.btn}>
          <div className={styles.inner1}></div>
          <div className={styles.inner2}>马上邀请好友</div>
        </div>
        <div className={styles.process}>
          <div className={styles.header}>
            活动进度
            <div className={styles.tips}>您已累计获得￥40元优惠券</div>
          </div>
          <div className={styles.main}>
            <div className={styles.row}>
              <div className={styles.left}>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
              </div>
              <div className={styles.right + ' ' + styles.ing}>还差2人</div>
            </div>
            <div className={styles.row}>
              <div className={styles.left}>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
              </div>
              <div className={styles.right}>
                <div className={styles.sbtn}>领取优惠券</div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.left}>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
              </div>
              <div className={styles.right + ' ' + styles.finish}>已领取</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Invite.propTypes = {
};

export default connect()(Invite);
