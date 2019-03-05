import React, {Component} from 'react';
import { withRouter } from 'dva/router';
import styles from './index.less';

import { message, Popover, Icon } from 'antd';
import moment from 'moment';
import { getToken, liveMemberCardUseful } from '../../utils';
import PopupLogin from '../PopupLogin';
import simleLogo from '../../assets/smile.svg';
import posterHeaderPng from '../../assets/live-poster-header.png';
import closeSvg from '../../assets/live-poster-close.svg';

const liveStatus = {
  ENROLLING: '报名中',
  ONGOING: '直播中',
  ENDED: '已结束',
}

let helpedTipsShow = false;
let enrollForShow = true;

class EnrollPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterShow: false,
      loginPopupShow: false,
      init: false,
    };
  }

  openPoster () {
    this.setState({
      posterShow: true,
    });
  }

  closePoster () {
    this.setState({
      posterShow: false,
    });
  }

  async liveInviting () {
    const { dispatch, live, invitor, userInfo } = this.props;

    this.openPoster();

    if (userInfo.status === 'INVITING') {
      return false;
    }

    await dispatch({
      type: 'live/liveInviting',
      payload: {
        data: {
          id: live.id
        }
      },
      onResult (res) {}
    });

    await dispatch({
      type: 'live/fetchLiveDetail',
      payload: {
        data: {
          id: live.id
        }
      },
      onResult (res) {}
    });
  }

  canEnrollFor () {
    const { invitor, userInfo } = this.props;
    return userInfo.enrolled === 'N' // 没报名
      && !userInfo.enrolledFor // 没帮助过别人
      && (invitor ? true : false) 
      && invitor !== getToken();
  }

  async enrollFor () {
    const { dispatch, live, invitor, userInfo } = this.props;
    // 不能帮自己助力
    if (invitor.wechatOpenId === userInfo.wechatOpenId) {
      message.error('很抱歉，你不能为自己助力~');
      return false;
    }
    // 判断是否能帮助别人报名
    const canEnrollFor = this.canEnrollFor();
    helpedTipsShow = true;

    if (canEnrollFor) {
      await dispatch({
        type: 'live/enrollFor',
        payload: {
          data: {
            id: live.id,
            invitor: invitor.wechatOpenId,
          }
        },
        onResult (res) {
          if (res.data.code === 0) {
            message.success('你已成功帮你的好友助力+1');
            helpedTipsShow = true;
            window.history.pushState(null, null, `/#/live/${live.id}`);
          } else {
            message.error('系统出了点问题，请稍后再试~');
          }
        }
      });
    } 
  }

  async enroll () {
    const { dispatch, live, userInfo, coupon } = this.props;
    if (!userInfo.phone) {
      this.setState({
        loginPopupShow: true,
      })
      // history.push('/login');
      return false;
    }
    if (userInfo.enrolled === 'Y') {
      return false;
    }
    // VIP 或者免费课直接调用报名接口了
    if ((userInfo.liveVip === 'Y' && liveMemberCardUseful(coupon.liveVip)) || live.price === 0) {
      await dispatch({
        type: 'live/liveEnroll',
        payload: {
          data: {
            id: live.id
          }
        },
        onResult (res) {
          if (res.data.code === 0) {
            message.success('您已成功报名~');
          }
        }
      });

      await dispatch({
        type: 'live/fetchLiveDetail',
        payload: {
          data: {
            id: live.id
          }
        },
        onResult (res) {}
      });

      return false;
    }

    // 调用支付接口
    const data = {
      id: live.id
    }
    const that = this;
    dispatch({
      type: 'live/createPayOrder',
      payload: {
        data
      },
      onResult (res) {
        if (res.data.code === 0) {
          const { appId, nonceStr, paySign, timeStamp, tradeNo } = res.data.data;
          wx.chooseWXPay({
            timestamp: timeStamp,
            appId: appId,
            nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
            package: res.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paySign, // 支付签名
            success: async (res) => {
              message.success('支付成功~');
              await dispatch({
                type: 'common/paySuccess',
                payload: {
                  data: {
                    tradeNo,
                  }
                },
                onResult(res) {}
              })
              await dispatch({
                type: 'live/fetchLiveDetail',
                payload: {
                  data: {
                    id: live.id
                  }
                },
                onResult (res) {}
              });
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

  componentDidUpdate() {
    // 如果是 vip 自动报名
    const { init } = this.state;
    const { userInfo, coupon, live } = this.props;
    if ( live.status === 'ONGOING' && userInfo.liveVip === 'Y' && liveMemberCardUseful(coupon.liveVip) && !init) {
      this.enroll();
      this.setState({
        init: true,
      })
    }
  }

  async loginCallback() {
    const { dispatch } = this.props;
    this.setState({
      loginPopupShow: false,
    });
    await dispatch({
      type: 'common/fetchUserInfo',
      payload: {},
    });
    this.enroll();
  }

  closePopup() {
    this.setState({
      loginPopupShow: false,
    });
  }

  render() {
    const { posterShow, loginPopupShow } = this.state;
    const { live, userInfo, invitor, coupon, dispatch } = this.props;
    const showInvitorTips = this.canEnrollFor() && enrollForShow;

    if (!helpedTipsShow && userInfo.enrolled === 'Y' && invitor) {
      message.error('你已报名本次课程，不能再为好友助力喽～');
      helpedTipsShow = true;
    } else if (!helpedTipsShow && userInfo.enrolledFor && invitor) {
      message.error('你已帮好友助力过喽～');
      helpedTipsShow = true;
    }

    moment.locale('zh-cn');
    const openTime = moment(live.openTime);
    const openTimeStr = openTime.format('MM-DD');
    const openTimeWeekStr = openTime.format('dddd');
    const openTimeHourStr = openTime.format('HH:mm');

    const enrollCount = (live.vipEnrolledTimes || 0) + (live.purchasedTimes || 0) + (live.freeEnrolledTimes || 0); // 报名人数等于买的人数加上免费报名的人数

    let signup;
    if (userInfo.status === 'ENROLLED') {
      if (userInfo.invitedUserList) {
        // 免费获取而来的
        signup = 'free';
      } else {
        // 付费报名的
        signup = 'paid';
      }
    } else {
      if (userInfo.liveVip === 'Y' && liveMemberCardUseful(coupon.liveVip)) {
        signup = 'vip';
      } else {
        if (userInfo.status === 'INVITING') {
          // 正在邀请的
          signup = 'inviting';
        } else if (userInfo.status === 'NONE') {
          signup = 'init';
        }
      }

      // 如果这个课这个课免费
      if (live.price == 0) {
        signup = 'freeToGet';
      }
    }

    // 邀请样式
    let invitingDom;
    if (signup === 'init') {
      invitingDom = <div className={styles.item}>
        <div className={styles.left}>
          <div className={styles.inner}>邀请{live.inviteRequire}个好友可免费学习</div>
        </div>
        <div className={styles.right} onClick={this.liveInviting.bind(this)}>我要免费报名</div>
      </div>;
    } else if (signup === 'inviting') {
      const invitedUserList = userInfo.invitedUserList;
      let left = live.inviteRequire;
      if (userInfo.invitedUserList) {
        left -= userInfo.invitedUserList.length;
      }
      const emptyItems = [];
      for (let i = 0; i < left; i++) {
        emptyItems.push(<div className={styles.avatar} key={i + '-2'}><img src={simleLogo} /></div>)
      }
      invitingDom = <div className={styles.item + ' ' + styles.big}>
        <div className={styles.left}>
          <div className={styles.inner}>再邀请{left}个好友即可免费</div>
          <div className={styles.users}>
            {
              invitedUserList && invitedUserList.map((d, i) => {
                return <div className={styles.avatar} key={i + '-1'} style={{ backgroundImage: `url(${d.headImg})` }}></div>
              })
            }
            { emptyItems }
          </div>
        </div>
        <div className={styles.right + ' ' + styles.big} onClick={this.liveInviting.bind(this)}>我要免费报名</div>
      </div>
    }

    let status = live.status;
    // status = 'ONGOING';
    let statusClass;
    if (status === 'ENROLLING') {
      statusClass = ' ' + styles.before;
    } else if (status === 'ONGOING') {
      statusClass = ' ' + styles.ing;
    } else if (status === 'ENDED') {
      statusClass = ' ' + styles.end;
    }

    return (
      <div className={styles.enrollPanel}>
        { loginPopupShow && <PopupLogin successCallback={this.loginCallback.bind(this)} dispatch={dispatch} closePopup={this.closePopup.bind(this)} /> }
        { 
          showInvitorTips && <div className={styles.helpPeople}>
            <div className={styles.bg}></div>
            <div className={styles.box}>
              <div className={styles.name}>
                我是{invitor && invitor.nickname}
              </div>
              <div className={styles.tips}>
                请帮我点击<span>[助力]</span>免费获取听课特权
              </div>
              <div className={styles.btn} onClick={() => {
                this.enrollFor.call(this);
                enrollForShow = false;
                this.forceUpdate();
              }}>
                助力
              </div>
            </div>
          </div> 
        }
        <div className={styles.course}>
          <div className={styles.left}>
            <div className={styles.tag + statusClass}>
              {/* {liveStatus[status]} */}
              {/* <div className={styles.tri}></div> */}
            </div>
            {
              status === 'ENROLLING' && <div className={styles.time}>{openTimeStr}&nbsp;{openTimeWeekStr}&nbsp;{openTimeHourStr}</div>
            }
            {
              (status === 'ONGOING' || status === 'ENDED') && <div className={styles.time + statusClass}>{live.speakerNick}：{live.title}</div>
            }
          </div>
          { 
            status !== 'ENDED' && (signup === 'paid' || signup === 'free' || (signup === 'vip' && status === 'ONGOING') ? 
              <div className={styles.paid}></div> : 
              <div className={styles.right}>已有{enrollCount}人报名</div>)
          }
        </div>
        { 
          status !== 'ENDED' && <div>
            { 
              (signup === 'inviting' || signup === 'init') && <div className={styles.signups}>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.inner}>本次直播课&nbsp;￥{live.price / 100}</div>
                  </div>
                  <div className={styles.right} onClick={this.enroll.bind(this)}>我要付费报名</div>
                </div>
                { invitingDom }
              </div>
            }
            {
              signup === 'vip' && status === 'ENROLLING' && <div className={styles.signups}>
                <div className={styles.item + ' ' + styles.vip}>
                  <div className={styles.left}>
                    <div className={styles.inner}>
                      <span className={styles.price}>￥{live.price / 100}</span>
                      你是公开课会员，可以免费收看
                    </div>
                  </div>
                  <div className={styles.right} onClick={this.enroll.bind(this)}>报名</div>
                </div>
              </div>
            }
            {
              signup === 'freeToGet' && <div className={styles.signups}>
                <div className={styles.item + ' ' + styles.vip}>
                  <div className={styles.left}>
                    <div className={styles.inner}>
                      {/* <span className={styles.price}>￥{live.price / 100}</span> */}
                      本次直播课免费报名参与
                    </div>
                  </div>
                  <div className={styles.right} onClick={this.enroll.bind(this)}>报名</div>
                </div>
              </div>
            }
            {
              posterShow && <div className={styles.poster}>
                <div className={styles.main}>
                  <div className={styles.ptips}><img src={posterHeaderPng} /></div>
                  <div className={styles.image}>
                    <img src={userInfo.invitePoster} />
                  </div>
                  <div className={styles.psteps}>
                    <div className={styles.item}>
                      <div className={styles.index}>1</div>
                      <div className={styles.text}>将<b>上图海报</b>分享到你的朋友圈</div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.index}>2</div>
                      <div className={styles.text}>获{live.inviteRequire}个好友扫码进直播间<b>[助力]</b></div>
                    </div>
                    <div className={styles.item}>
                      <div className={styles.index}>3</div>
                      <div className={styles.text}>助力成功后，你即可<b>免费听课</b></div>
                    </div>
                  </div>
                  <div className={styles.close} onClick={this.closePoster.bind(this)}></div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

export default withRouter(EnrollPanel);
