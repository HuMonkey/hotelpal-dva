import React, {Component} from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

import { Navs } from '../../components';

import hbBg from '../../assets/invite-hb.png';
import simleLogo from '../../assets/smile.svg';

class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { invite } = this.props;

    const { totalCoupon, inviteList } = invite;

    const inviteDom = inviteList.map(d => {
      const { batch, CouponCollected, userList } = d;
      const left = 3;
      const userListLength = userList ? userList.length : 0;
      const avatars = [];
      for (let i = 0; i < userListLength; i++) {
        avatars.push(<div className={styles.avatar}><img src={userList[i].headImg} /></div>);
      }
      const emptys = [];
      for (let i = 0; i < 3 - userListLength; i++) {
        avatars.push(<div className={styles.avatar}><img src={simleLogo} /></div>);
      }
      return <div className={styles.row} key={batch}>
        <div className={styles.left}>
          {avatars}
          {emptys}
        </div>
        {
          CouponCollected === 'N' && userList.length < 3 && <div className={styles.right + ' ' + styles.ing}>还差{3 - userList.length}人</div>
        }
        {
          CouponCollected === 'N' && userList.length === 3 && <div className={styles.right}>
            <div className={styles.sbtn}>领取优惠券</div>
          </div>
        }
        {CouponCollected === 'Y' && <div className={styles.right + ' ' + styles.finish}>已领取</div>}
      </div>
    })

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
            <div className={styles.tips}>您已累计获得￥{totalCoupon}元优惠券</div>
          </div>
          <div className={styles.main}>
            {/* <div className={styles.row}>
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
            </div> */}
            {inviteDom}
          </div>
        </div>
      </div>
    );
  }
}

Invite.propTypes = {
};

const mapStateToProps = (state) => {
  return { invite: state.invite, common: state.common };
}

export default connect(mapStateToProps)(Invite);
