import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { message, Popover } from 'antd';
import moment from 'moment';
import { getToken } from '../../utils';

import simleLogo from '../../assets/smile.svg';

const liveStatus = {
  ENROLLING: '报名中',
  ONGOING: '直播中',
  ENDED: '已结束',
}

let helpedTipsShow = false;

class EnrollPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enrollForShow: true,
      posterShow: false,
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

    // if (!userInfo.enrolledFor && invitor) {
    //   dispatch({
    //     type: 'live/enrollFor',
    //     payload: {
    //       data: {
    //         invitor,
    //         id: live.id,
    //       }
    //     },
    //     onResult (res) {
    //       if (res.data.code === 0) {
    //         message.success('您已经成功帮好友解锁~');
    //       } else {
    //         message.error(res.data.messages[0]);
    //       }
    //     }
    //   });
    // }

    this.enrollFor();

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
    const { dispatch, live, invitor } = this.props;
    // 判断是否能帮助别人报名
    const canEnrollFor = this.canEnrollFor();
    helpedTipsShow = true;

    if (canEnrollFor) {
      // await dispatch({
      //   type: 'live/save',
      //   payload: {
      //     invitor: null
      //   },
      //   onResult (res) {}
      // });
      dispatch({
        type: 'live/enrollFor',
        payload: {
          id: live.id,
          invitor,
        },
        onResult (res) {
          if (res.data.code === 0) {
            message.success('您已经成功帮好友解锁~');
            window.history.pushState(null, null, `/#/live/${live.id}`);
          } else {
            message.error('系统出了点问题，请稍后再试~');
          }
        }
      });
    } 
  }

  async enroll () {
    const { dispatch, live, userInfo } = this.props;

    // VIP 或者免费课直接调用报名接口了
    if (userInfo.liveVip === 'Y' || live.price === 0) {
      await dispatch({
        type: 'live/liveEnroll',
        payload: {
          data: {
            id: live.id
          }
        },
        onResult (res) {}
      });

      message.success('您已成功报名~');

      await dispatch({
        type: 'live/fetchLiveDetail',
        payload: {
          data: {
            id: live.id
          }
        },
        onResult (res) {}
      });
      
      this.enrollFor();

      return false;
    }

    // 调用支付接口
    const data = {
      id: live.id
    }
    // TODO
    dispatch({
      type: 'live/createPayOrder',
      payload: {
        data
      },
      onResult (res) {
        if (res.data.code === 0) {
          const { appId, nonceStr, paySign, timeStamp } = res.data.data;
          wx.chooseWXPay({
            timestamp: timeStamp,
            appId: appId,
            nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
            package: res.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paySign, // 支付签名
            success: (res) => {
              // TODO 支付成功后的回调函数
              message.success('支付成功~');
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

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        enrollForShow: false,
      })
    }, 8000) // 8秒后隐藏提示
  }

  render() {
    const { enrollForShow, posterShow } = this.state;
    const { live, userInfo, invitor } = this.props;

    const showInvitorTips = this.canEnrollFor() && enrollForShow;
    
    if (!helpedTipsShow && userInfo.enrolled === 'Y' && invitor) {
      message.error('你已经报名，不能帮好友解锁~');
      helpedTipsShow = true;
    } else if (!helpedTipsShow && userInfo.enrolledFor && invitor) {
      message.error('你已经帮助过别人了~');
      helpedTipsShow = true;
    }

    moment.locale('zh-cn');
    const openTime = moment(live.openTime);
    const openTimeStr = openTime.format('MM-DD');
    const openTimeWeekStr = openTime.format('dddd');
    const openTimeHourStr = openTime.format('hh:mm');

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
      if (userInfo.liveVip === 'Y') {
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
          <div className={styles.inner}>邀请{live.inviteRequire}个好友可以免费</div>
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
        <Popover placement="top" content={`报名即可帮助XXX获取免费报名资格`} visible={showInvitorTips}>
          <div className={styles.course}>
            <div className={styles.left}>
              <div className={styles.tag + statusClass}>
                {liveStatus[status]}
                <div className={styles.tri}></div>
              </div>
              <div className={styles.time}>{openTimeStr}&nbsp;{openTimeWeekStr}&nbsp;{openTimeHourStr}</div>
            </div>
            { 
              status !== 'ENDED' && (signup === 'paid' || signup === 'free' || (signup === 'vip' && status === 'ONGOING') ? 
                <div className={styles.paid}></div> : 
                <div className={styles.right}>已有{enrollCount}人报名</div>)
            }
          </div>
        </Popover>
        { 
          status !== 'ENDED' && <div>
            { 
              (signup === 'inviting' || signup === 'init') && <div className={styles.signups}>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.inner}>直播价&nbsp;￥{live.price / 100}</div>
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
                      本次公开课可以免费报名
                    </div>
                  </div>
                  <div className={styles.right} onClick={this.enroll.bind(this)}>报名</div>
                </div>
              </div>
            }
            {
              posterShow && <div className={styles.poster}>
                <div className={styles.main}>
                  <div className={styles.header}>
                    <div className={styles.numbers}>
                      <div className={styles.vl}></div>
                      <div className={styles.item}>1</div>
                      <div className={styles.item}>2</div>
                      <div className={styles.item}>3</div>
                    </div>
                    <div className={styles.row}>将专属邀请卡分享给好友</div>
                    <div className={styles.row}>{live.inviteRequire}个好友点击报名（免费/付费均可）</div>
                    <div className={styles.row}>可享受免费报名！</div>
                  </div>
                  <div className={styles.image}>
                    <img src={userInfo.invitePoster} />
                  </div>
                  <div className={styles.btn}>长按保存图片</div>
                </div>
                <div className={styles.close} onClick={this.closePoster.bind(this)}></div>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

export default EnrollPanel;