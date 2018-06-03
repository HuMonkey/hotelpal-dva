import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { message, Popover } from 'antd';
import moment from 'moment';
import { getToken } from '../../utils';

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

    if (!userInfo.enrolledFor && invitor) {
      dispatch({
        type: 'live/enrollFor',
        payload: {
          data: {
            invitor,
            id: live.id,
          }
        },
        onResult (res) {
          message.error(res.data.messages[0]);
        }
      });
    }

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

  enroll () {
    const { dispatch, live, invitor, userInfo } = this.props;

    // VIP 直接调用报名接口了
    if (userInfo.liveVip === 'Y') {
      dispatch({
        type: 'live/liveEnroll',
        payload: {
          data: {
            id: live.id
          }
        },
        onResult (res) {
          console.log(res);
        }
      });
      if (invitor && invitor !== getToken()) {
        dispatch({
          type: 'live/enrollFor',
          payload: {
            id: live.id,
            invitor,
          },
          onResult (res) {}
        });
        dispatch({
          type: 'live/save',
          payload: {
            invitor: null
          },
          onResult (res) {}
        });
      } 
      return false;
    }

    // TODO 调用支付接口
    message.error('支付还没写好！');
    
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        enrollForShow: false,
      })
    }, 8000)
  }

  render() {
    const { enrollForShow, posterShow } = this.state;
    const { live, userInfo, invitor } = this.props;

    const showInvitorTips = !userInfo.enrolledFor // 没帮过别人
      && enrollForShow // 八秒后隐藏
      && (live.invitor ? true: false); // 是否是邀请链接点进来
    
    if (!helpedTipsShow && userInfo.enrolledFor && invitor) {
      message.error('你已经帮助过别人了！');
      helpedTipsShow = true;
    }

    moment.locale('zh-cn');
    const openTime = moment(live.openTime);
    const openTimeStr = openTime.format('MM-DD');
    const openTimeWeekStr = openTime.format('dddd');
    const openTimeHourStr = openTime.format('hh:mm');

    const enrollCount = live.purchasedTimes || 0 + live.freeEnrolledTimes || 0; // 报名人数等于买的人数加上免费报名的人数

    let signup;
    if (userInfo.status === 'ENROLLED') {
      if (userInfo.invitedUserList) {
        // 免费获取的
        signup = 'free';
      } else {
        // 付费报名
        signup = 'paid';
      }
    } else if (userInfo.status === 'INVITING') {
      // 正在邀请
      signup = 'inviting';
    } else if (userInfo.status === 'NONE') {
      if (userInfo.liveVip !== 'N') {
        // VIP
        signup = 'vip';
      } else {
        signup = 'init';
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
                return <div className={styles.avatar} key={i + '-1'}><img src={d.headImg} /></div>
              })
            }
            { emptyItems }
          </div>
        </div>
        <div className={styles.right + ' ' + styles.big} onClick={this.liveInviting.bind(this)}>我要免费报名</div>
      </div>
    }

    const status = live.status;
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
                {liveStatus[live.status]}
                <div className={styles.tri}></div>
              </div>
              <div className={styles.time}>{openTimeStr}&nbsp;{openTimeWeekStr}&nbsp;{openTimeHourStr}</div>
            </div>
            { signup === 'paid' || signup === 'free' ? <div className={styles.paid}></div> : <div className={styles.right}>已有{enrollCount}人报名</div> }
          </div>
        </Popover>
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
          signup === 'vip' && <div className={styles.signups}>
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
                <div className={styles.row}>5个好友点击报名（免费/付费均可）</div>
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
    )
  }
}

export default EnrollPanel;
