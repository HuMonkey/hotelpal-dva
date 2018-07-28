import React, {Component} from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

import { Navs, ShareTips } from '../../components';
import { configWechat, updateWechatShare, getToken } from '../../utils';

import hbBg from '../../assets/invite-hb.png';
import simleLogo from '../../assets/smile.svg';

class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleShow: false,
      shareShow: false,
      init: false,
    };
  }

  async updateWechatShare () {
    const { dispatch, common } = this.props;

    const dict = {
      title: `${common.userInfo.nickname}邀请你加入酒店邦成长营，一起收获知识！`,
      link: `${location.origin}/#/invitePage?invitor=${getToken()}`,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: `点击注册成为酒店邦成长营用户，获得价值20元学习券`,
    }

    await dispatch({
      type: 'common/getWechatSign',
      payload: {
        data: {
          url: location.href.split('#')[0]
        }
      },
      onResult (res) {
        if (res.data.code === 0) {
          const {appid, noncestr, sign, timestamp, url} = res.data.data;
          configWechat(appid, timestamp, noncestr, sign, () => {
            updateWechatShare(dict);
          });
        }
      }
    });
  }

  switchRule (ruleShow) {
    this.setState({
      ruleShow
    })
  }

  switchShare (shareShow) {
    this.setState({
      shareShow
    })
  }

  async getCoupon (batch) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'coupon/getCoupon',
      payload: {
        data: {
          batch
        }
      },
      onResult () {}
    });
    dispatch({
      type: 'invite/fetchInviteRegList',
      payload: {},
      onResult () {}
    });
  }

  componentDidUpdate () {
    const { init } = this.state;
    const { common } = this.props;
    if (!init && common.userInfo) {
      this.setState({
        init: true,
      })
      this.updateWechatShare();
    }
  }

  render() {
    const { ruleShow, shareShow } = this.state;
    const { invite } = this.props;

    const { totalCoupon } = invite;
    const inviteList = invite.inviteList && invite.inviteList.slice(0) || [];

    if (inviteList.length > 0) {
      const userList = inviteList[0].userList;
      if (userList && userList.length === 3) {
        inviteList.unshift({});
      }
    }

    const inviteDom = inviteList && inviteList.map((d, ii) => {
      const { batch, couponCollected, userList } = d;
      const userListLength = userList ? userList.length : 0;
      const avatars = [];
      for (let i = 0; i < userListLength; i++) {
        avatars.push(<div className={styles.avatar} key={i} style={{ backgroundImage: `url(${userList[i].headImg})` }}></div>);
      }
      const emptys = [];
      for (let i = 0; i < 3 - userListLength; i++) {
        avatars.push(<div className={styles.avatar} key={3 - i}><img src={simleLogo} /></div>);
      }
      return <div className={styles.row} key={ii}>
        <div className={styles.left}>
          {avatars}
          {emptys}
        </div>
        {
          couponCollected !== 'Y' && userListLength < 3 && <div className={styles.right + ' ' + styles.ing}>还差{3 - userListLength}人</div>
        }
        {
          couponCollected !== 'Y' && userListLength === 3 && <div className={styles.right}>
            <div className={styles.sbtn} onClick={() => {
              this.getCoupon.call(this, batch);
            }}>领取优惠券</div>
          </div>
        }
        {couponCollected === 'Y' && <div className={styles.right + ' ' + styles.finish}>已领取</div>}
      </div>
    })

    return (
      <div className={styles.normal}>
        <Navs/>
        {shareShow && <ShareTips clickCallBack={() => {
          this.switchShare.call(this, false);
        }} type="invite" />}
        <img src={hbBg} className={styles.bg} />
        <div className={styles.title}>送好友<span>20</span>元优惠券</div>
        <div className={styles.stitle}>每三个好友注册后你也能获得40元优惠券</div>
        <div className={styles.goto} onClick={() => {
          this.switchRule.call(this, true);
        }}>活动规则<Icon className={styles.icon} type="right" /></div>
        <div className={styles.btn}>
          <div className={styles.inner1}></div>
          <div className={styles.inner2} onClick={() => {
            this.switchShare.call(this, true);
          }}>马上邀请好友</div>
        </div>
        <div className={styles.process}>
          <div className={styles.header}>
            活动进度
            <div className={styles.tips}>您已累计获得￥{totalCoupon / 100}元优惠券</div>
          </div>
          <div className={styles.main}>
            {inviteDom}
          </div>
        </div>
        {
          ruleShow && <div className={styles.rules}>
            <div className={styles.main}>
              <div className={styles.close} onClick={() => {
                this.switchRule.call(this, false);
              }}/>
              <div className={styles.stitle}>活动规则</div>
              <div>
                <div className={styles.row}>
                  <div className={styles.index}>1</div>
                  邀请对象仅限于未注册[酒店邦成长营]的新用户；
                </div>
                <div className={styles.row}>
                  <div className={styles.index}>2</div>
                  新用户通过邀请链接注册后可获得一张20元优惠券，购买订阅专栏和在线实战营可用，有效期30天；
                </div>
                <div className={styles.row}>
                  <div className={styles.index}>3</div>
                  3位新用户注册成功后，邀请人即获得价值40元的优惠券，购买订阅专栏和在线实战营可用，有效期30天；
                </div>
                <div className={styles.row}>
                  <div className={styles.index}>4</div>
                  在参与活动过程中，如发现违规行为，违规行为包括但不限于恶意批量注册、无效手机、虚假信息，酒店邦成长营将封停账号，并撤销获得的相关赠品。
                </div>
              </div>
            </div>
          </div>
        }
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
