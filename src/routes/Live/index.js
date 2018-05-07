import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import styles from './index.less';

import { Navs, PopupCourse, PopupLogin, PopupOrder } from '../../components';

import { Icon, Input } from 'antd';

import hbBg from '../../assets/hb-bg.png';
import simleLogo from '../../assets/smile.svg';

import { formatNum } from '../../utils';

const liveStatus = {
  ENROLLING: '报名中',
  ONGOING: '直播中',
  ENDED: '已结束',
}

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterShow: false,
      hongbaoShow: false,
      page: 'detail', // detail or chat
      signup: 'init', // inviting init paid vip free
      state: 'ing', // before ing after
      taOpen: false,
      scroll: 'ad', // 'hb' or 'ad'
      popup: null, // detail, order, login
      playerInit: false,
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

  openHongbao () {
    this.setState({
      hongbaoShow: true,
    });
  }

  closeHongbao () {
    this.setState({
      hongbaoShow: false,
    });
  }

  changePage (page) {
    this.setState({
      page
    })
  }

  switchTa (taOpen) {
    this.setState({
      taOpen
    })
  }

  openHongbao () {
    // TODO 打开红包
    this.setState({
      hongbaoShow: false,
    });
  }

  openCourceDetail () {
    this.setState({
      popup: 'detail',
    });
  }

  closePopup () {
    this.setState({
      popup: null,
    });
  }

  async liveInviting () {
    const { dispatch, live } = this.props;
    const { liveDetail } = live;
    const { userInfo } = liveDetail;

    this.setState({
      posterShow: true,
    });

    if (userInfo.status === 'INVITING') {
      return false;
    }

    await dispatch({
      type: 'live/liveInviting',
      payload: {
        data: {
          id: liveDetail.id
        }
      },
      onResult (res) {}
    });

    await dispatch({
      type: 'live/fetchLiveDetail',
      payload: {
        data: {
          id: liveDetail.id
        }
      },
      onResult (res) {}
    });
  }

  enroll () {
    const { dispatch, live, userInfo } = this.props;
    const { liveDetail } = live;

    // VIP 直接调用报名接口了
    if (userInfo.liveVip === 'Y') {
      dispatch({
        type: 'live/liveEnroll',
        payload: {
          data: {
            id: liveDetail.id
          }
        },
        onResult (res) {
          console.log(res);
        }
      });
      return false;
    }

    // TODO 调用支付接口
    
  }

  componentDidUpdate () {
    const { playerInit } = this.state;
    if (playerInit || !this.refs.player) {
      return false;
    }

    const player = new Aliplayer({
      id: 'J_prismPlayer',
      width: '100%',
      autoplay: false,
      source: '//lv.hotelpal.cn/app/stream.m3u8',
    }, function(player) {
      console.log('播放器创建好了。')
    });
    this.setState({
      playerInit: true,
    })
  }

  render () {
    const { live, common } = this.props;

    const { liveDetail, now, countDownInter } = live;

    if (!liveDetail) {
      return <div></div>
    }

    const userInfo = Object.assign({}, common.userInfo, liveDetail.userInfo);
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

    const { relaCourse } = liveDetail;

    const { posterShow, page, taOpen, hongbaoShow, scroll, popup } = this.state;

    const detailClass = page === 'detail' ? ' ' + styles.active : '';
    const chatClass = page === 'chat' ? ' ' + styles.active : '';
    const taClass = taOpen ? ' ' + styles.open : '';

    const taComments = taOpen ? [1, 1, 1] : [1, 1, 1].slice(0, 1);
    const taDom = taComments.map((d, i) => {
      const hasPic = false;
      const hasPicClass = hasPic ? ' ' + styles.hasPic : '';
      return <div key={i} className={styles.item + hasPicClass}>
        <div className={styles.left}>
          <div className={styles.title}>
            <div className={styles.name}>
              <div className={styles.icon}><div className={styles.tri}></div></div>
              <div className={styles.text}>助教小燕子</div>
            </div>  
            <div className={styles.time}>20:32:43</div>
          </div>  
          <div className={styles.comment}>评论评论评论评论评论评论评论评论评论评论评论评论</div>
        </div>
        { hasPic && <div className={styles.right}></div> }
      </div>
    });

    const comments = [1, 1, 1, 1];
    const commentsDom = comments.map((d, i) => {
      const isMine = i === 2;
      const isMineClass = isMine ? ' ' + styles.mine : '';
      return <div className={styles.item + isMineClass} key={i}>
        <div className={styles.avatar}></div>
        <div className={styles.main}>
          <div className={styles.name}>陈熙慧 酒店邦</div>
          <div className={styles.talk}>
            <div className={styles.inner}>121212121212123123123123123121212121212123123123123123121212121212123123123123123121212121212123123123123123121212121212123123123123123</div>
            <div className={styles.arrow}></div>
          </div>
        </div>
      </div>
    })

    let invitingDom;
    if (signup === 'init') {
      invitingDom = <div className={styles.item}>
        <div className={styles.left}>
          <div className={styles.inner}>邀请5个好友可以免费</div>
        </div>
        <div className={styles.right} onClick={this.liveInviting.bind(this)}>我要免费报名</div>
      </div>;
    } else if (signup === 'inviting') {
      invitingDom = <div className={styles.item + ' ' + styles.big}>
        <div className={styles.left}>
          <div className={styles.inner}>再邀请2个好友即可免费</div>
          <div className={styles.users}>
            <div className={styles.avatar}><img src={simleLogo} /></div>
            <div className={styles.avatar}><img src={simleLogo} /></div>
            <div className={styles.avatar}><img src={simleLogo} /></div>
            <div className={styles.avatar}><img src={simleLogo} /></div>
            <div className={styles.avatar}><img src={simleLogo} /></div>
          </div>
        </div>
        <div className={styles.right + ' ' + styles.big} onClick={this.liveInviting.bind(this)}>我要免费报名</div>
      </div>
    }

    const hongbaoDom = <div className={styles.hb}>
      <div className={styles.main} style={{ backgroundImage: `url(${hbBg})` }}>
        <div className={styles.price}>￥<span>20</span></div>
        <div className={styles.btn} onClick={this.openHongbao.bind(this)}>抢</div>
      </div>
      <div className={styles.close} onClick={this.closeHongbao.bind(this)}></div>
    </div>;

    moment.locale('zh-cn');
    const openTime = moment(liveDetail.openTime);
    const openTimeStr = openTime.format('MM-DD');
    const openTimeWeekStr = openTime.format('dddd');
    const openTimeHourStr = openTime.format('hh:mm');

    const enrollCount = liveDetail.purchasedTimes || 0 + liveDetail.freeEnrolledTimes || 0;

    const diffTime = openTime - now;
    const duration = moment.duration(diffTime, 'milliseconds');
    if (diffTime <= 0) {
      clearInterval(countDownInter);
    }

    function createMarkupIntro() { return { __html: liveDetail.introduce || '暂无' }; };
  
    return (
      <div className={styles.normal}>
        { hongbaoShow && hongbaoDom }
        {
          popup && <div>
            { popup === 'detail' && <PopupCourse course={relaCourse} closePopup={this.closePopup.bind(this)} /> }
            { popup === 'login' && <PopupLogin closePopup={this.closePopup.bind(this)} /> }
            { popup === 'order' && <PopupOrder closePopup={this.closePopup.bind(this)} /> }
          </div>
        }
        <Navs/>
        <div className={styles.banner}>
          { 
            diffTime > 0 && <div className={styles.count}>
              <div className={styles.icon}></div>
              <div className={styles.label}>倒计时</div>
              <div className={styles.tick}>
                <span className={styles.item}>{formatNum(duration.days())}</span>
                :
                <span className={styles.item}>{formatNum(duration.hours())}</span>
                :
                <span className={styles.item}>{formatNum(duration.minutes())}</span>
                :
                <span className={styles.item}>{formatNum(duration.seconds())}</span>
              </div>
            </div> 
          }
          <div className="prism-player">
            <div className={styles.player} id="J_prismPlayer" ref={`player`}></div>
          </div>
        </div>
        <div className={styles.switches}>
          <div 
            className={styles.item + detailClass} 
            onClick={() => this.changePage.call(this, 'detail')}>
            课程
          </div>
          <div className={styles.item + chatClass} onClick={() => this.changePage.call(this, 'chat')}>互动</div>
        </div>
        {
          page === 'detail' && <div>
            <div className={styles.course}>
              <div className={styles.left}>
                <div className={styles.tag + ' ' + styles.before}>
                  {liveStatus[liveDetail.status]}
                  <div className={styles.tri}></div>
                </div>
                <div className={styles.time}>{openTimeStr}&nbsp;{openTimeWeekStr}&nbsp;{openTimeHourStr}</div>
              </div>
              { signup === 'paid' || signup === 'free' ? <div className={styles.paid}></div> : <div className={styles.right}>已有{enrollCount}人报名</div> }
            </div>
            { 
              (signup === 'inviting' || signup === 'init') && <div className={styles.signups}>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.inner}>直播价&nbsp;￥{liveDetail.price / 100}</div>
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
                      <span className={styles.price}>￥{liveDetail.price / 100}</span>
                      你是公开课会员，可以免费收看
                    </div>
                  </div>
                  <div className={styles.right} onClick={this.enroll.bind(this)}>报名</div>
                </div>
              </div>
            }
            <div className={styles.intro}>
              <div className={styles.title}>公开课介绍</div>
              <div className={styles.content} dangerouslySetInnerHTML={createMarkupIntro()}></div>
            </div>
            <div className={styles.know}>
              <div className={styles.title}>公开课须知</div>
              <div className={styles.content}>这里要写死一段话</div>
            </div>
          </div>
        }
        {
          page === 'chat' && <div>
            <div className={styles.ta + taClass}>
              <div>
                {taDom}
              </div>
              <div className={styles.more}>
                { taOpen && <Icon onClick={() => this.switchTa.call(this, false)} type="up" /> }
                { !taOpen && <Icon onClick={() => this.switchTa.call(this, true)} type="down" /> }
              </div>
            </div>
            <div className={styles.comments}>
              {!taOpen && commentsDom}
            </div>
          </div>
        }
        { 
          page === 'chat' && <div className={styles.commentBox}>
            { 
              scroll === 'hb' ? <div className={styles.hongbao} onClick={this.openHongbao.bind(this)}>
                <div className={styles.inner}>
                  <div className={styles.square}>
                    <div className={styles.money}>￥<span>20</span></div>
                    <div className={styles.btn}>抢</div>
                    <div className={styles.time}>11:12:15</div>
                  </div>
                  <div className={styles.bubble1}></div>
                  <div className={styles.bubble2}></div>
                  <div className={styles.bubble3}></div>
                  <div className={styles.bubble4}></div>
                </div>
              </div> : <div className={styles.ad} onClick={this.openCourceDetail.bind(this)}>
                <div className={styles.inner}>
                  <div className={styles.avatar} style={{ backgroundImage: `url(${relaCourse.bannerImg})` }}></div>
                  <div className={styles.title}>{relaCourse.title}</div>
                </div>
              </div>
            }
            <div className={styles.input}>
              <div className={styles.pen}></div> 
              <input type="text" name="comment" placeholder="一起来参与讨论吧！" />
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
    );
  }
}

Live.propTypes = {
};

const mapStateToProps = (state) => {
  return { live: state.live, common: state.common };
}

export default connect(mapStateToProps)(Live);
