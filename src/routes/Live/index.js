import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './index.less';

import { Navs, PopupCourse, PopupLogin, PopupOrder, 
  IntroPanel, EnrollPanel, TaComments, Comments, LivePlayer } from '../../components';

import { message } from 'antd';
message.config({
  duration: 8,
});

import hbBg from '../../assets/hb-bg.png';

import { getHtmlContent, configWechat, updateWechatShare, formatNum, ua } from '../../utils';

let interval;

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hongbaoShow: false,
      page: 'detail', // detail or chat
      popup: null, // detail, order, hblogin, orderlogin
      replying: false,

      enrollForShow: true,

      hbCountDown: moment(),
      init: false,
    };
  }

  scrollToBottom () {
    document.getElementById('root').scrollTop = 20000000;
  }

  scrollToTop () {
    document.getElementById('root').scrollTop = 0;
  }

  showHongbao () {
    const { live } = this.props;
    const { couponInfo } = live;
    if (couponInfo.acquired === 'Y') {
      return false;
    }
    this.setState({
      hongbaoShow: true,
    });
  }

  hideHongbao () {
    this.setState({
      hongbaoShow: false,
    });
  }

  changePage (page) {
    this.setState({
      page
    }, () => {
      if (page === 'chat') {
        this.scrollToBottom();
      } else {
        this.scrollToTop();
      } 
    })
  }

  async openHongbao () {
    const { dispatch, live, common } = this.props;

    const { userInfo } = common;

    if (!userInfo.phone) {
      this.setState({
        popup: 'hblogin'
      })
      return false;
    }

    await dispatch({
      type: 'live/getCoupon',
      payload: {
        data: {
          id: live.liveDetail.id
        }
      },
      onResult(res) {
        if (res.data.code === 0) {
          message.success('您已成功获得优惠券~');
        } else {
          message.error(res.data.messages);
        }
      }
    })

    dispatch({
      type: 'live/getSysCouponInfo',
      payload: {
        data: {
          sysCouponId: live.liveDetail.sysCouponId
        }
      },
      onResult() {}
    })

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

  async closeLoginInHongbao () {
    const { dispatch } = this.props;
    this.setState({
      popup: null,
    });
    await dispatch({
      type: 'common/fetchUserInfo',
      payload: {},
    })
    // this.openHongbao();
  }

  async closeLoginInOrder() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'common/fetchUserInfo',
      payload: {},
    })
    this.setState({
      popup: 'order',
    });
  }

  componentDidUpdate (prevProps) {
    const { init, page } = this.state;
    const chats = this.props.live && this.props.live.chats;
    const prevChats = prevProps.live && prevProps.live.chats;

    if ((prevChats && prevChats.length) !== (chats && chats.length) && page === 'chat') {
      this.scrollToBottom();
    }

    const { live } = this.props;
    const { liveDetail } = live;

    if (!init && liveDetail) {
      this.setState({
        init: true,
      })
      this.updateWechatShare();
    }
  }

  setReply (replying) {
    this.setState({
      replying,
    }, () => {
      replying && this.refs.reply.focus();
    });
  }

  async submitComment () {
    const { dispatch, live } = this.props;
    const { liveDetail } = live;

    const reply = this.refs.reply.value;

    if (reply.length > 100) {
      message.error('聊天内容不能超过100个字~');
      return false;
    }

    await dispatch({
      type: 'live/addComment',
      payload: {
        data: {
          msg: reply,
          liveId: liveDetail.id
        }
      },
      onResult () {
        // message.success('成功发布评论~');
      }
    });
    await this.setState({
      replying: false,
    });
    this.scrollToBottom();
  }

  onCommentFocus () {
    this.scrollToBottom();
  }

  onCourseSubmit () {
    const { common } = this.props;
    // 没有手机号
    if (!common.userInfo.phone) {
      this.setState({
        popup: 'orderlogin',
      });
      return false;
    }
    this.setState({
      popup: 'order',
    })
  }

  async updateWechatShare () {
    const { dispatch, live, common } = this.props;
    const { liveDetail } = live;

    moment.locale('zh-cn');
    const openTime = moment(liveDetail.openTime);
    const openMonth = openTime.month();
    const openDate = openTime.date();
    const openTimeHourStr = openTime.format('HH:mm');

    const dict = {
      title: `${common.userInfo.nickname} | 邀请你参加【酒店邦成长营直播课】`,
      link: location.href,
      imgUrl: liveDetail.bannerImg || 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: `${openMonth + 1}月${openDate}日${openTimeHourStr}${liveDetail.speakerTitle}${liveDetail.speakerNick}，${liveDetail.title}`,
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
            document.title = '成长营直播间';
            const videoEl = document.getElementsByTagName('video')[0];
            videoEl && videoEl.play();
          });
        }
      }
    });
  }

  componentWillUnmount () {
    const {dispatch} = this.props;
    dispatch({
      type: 'live/reset',
    });
    interval && clearInterval(interval);
  }

  paySuccessCallback () {
    const { live, dispatch } = this.props;
    const { liveDetail } = live;
    const { userInfo } = liveDetail;
    const newUserInfo = Object.assign({}, userInfo, { relateCoursePurchased: 'Y' });
    const newLiveDetail = Object.assign({}, liveDetail, { userInfo: newUserInfo });
    dispatch({
      type: 'live/save',
      payload: {
        liveDetail: newLiveDetail
      }
    })
    this.closePopup();
  }

  gobackLoginInOrder() {
    this.setState({
      popup: 'detail',
    })
  }

  render () {
    const { live, common, dispatch, coupon } = this.props;

    const { liveDetail, couponInfo, now, countDownInter, assistantMsg, chats, hbShow, PPTImg, watchingPeopleNum } = live;

    if (!liveDetail) {
      return <div></div>
    }

    const userInfo = Object.assign({}, common.userInfo, liveDetail.userInfo);

    const { relaCourse } = liveDetail;

    const { page, hongbaoShow, popup, replying } = this.state;

    const detailClass = page === 'detail' ? ' ' + styles.active : '';
    const chatClass = page === 'chat' ? ' ' + styles.active : '';

    const hongbaoDom = couponInfo && <div className={styles.hb}>
      <div className={styles.main} style={{ backgroundImage: `url(${liveDetail.relaCourseCouponImg || hbBg})` }}>
        <div className={styles.price}>￥<span>{couponInfo.value / 100}</span></div>
        <div className={styles.btn} onClick={this.openHongbao.bind(this)}>抢</div>
      </div>
      <div className={styles.close} onClick={this.hideHongbao.bind(this)}></div>
    </div>;

    const isChatPageClass = page === 'chat' ? ' ' + styles.chat : '';
    const hasAssistClass = assistantMsg.length > 0 ? ' ' + styles.hasAssist : '';

    // 红包倒计时
    let hbCountDownStr = '';
    let couponExpired = false;
    if (couponInfo) {
      const expired = moment(couponInfo.validity);
      const diff = expired - now;
      if (diff < 0) {
        couponExpired = true;
      } else {
        const duration = moment.duration(diff, 'milliseconds');
        let hoursStr = formatNum(duration.days() * 24 + duration.hours());
        const minutesStr = formatNum(duration.minutes());
        const secondsStr = formatNum(duration.seconds());
        hbCountDownStr = hoursStr + ':' + minutesStr + ':' + secondsStr;
        // if (hoursStr > 99) {
        //   hbCountDownStr = '99:59:59';
        // }
      }
      if (couponInfo.validityType === 'FIXED_DAYS') {
        couponExpired = false;
      }
    }
    let couponClassName = '';
    if (couponInfo && couponInfo.acquired === 'Y') {
      couponClassName = ' ' + styles.got;
    }
    const couponDom = !couponExpired && couponInfo && <div className={styles.hongbao} onClick={this.showHongbao.bind(this)}>
      <div className={styles.inner}>
        <div className={styles.square}>
          {couponInfo.validityType === 'FIXED_DAYS' && <div className={styles.blank}></div>}
          <div className={styles.money}>￥<span>{couponInfo.value / 100}</span></div>
          <div className={styles.btn + couponClassName}>{ couponInfo.acquired === 'Y' ? '已领' : '抢' }</div>
          { couponInfo.validityType !== 'FIXED_DAYS' && <div className={styles.time}>{hbCountDownStr}</div> }
        </div>
        <div className={styles.bubble1}></div>
        <div className={styles.bubble2}></div>
        <div className={styles.bubble3}></div>
        <div className={styles.bubble4}></div>
      </div>
    </div>;

    return (
      <div className={styles.normal + isChatPageClass + hasAssistClass} id={`normal`} ref={`normal`}>
        {
          replying && <div className={styles.replyBox}>
            <div className={styles.cover} onClick={() => this.setReply.call(this, false)}></div> 
            <div className={styles.box}>
              <div className={styles.btns}>
                <div className={styles.cancel} onClick={() => this.setReply.call(this, false)}>取消</div> 
                <div className={styles.confirm} onClick={this.submitComment.bind(this)}>发布</div>
              </div> 
              <textarea maxLength="100" onFocus={this.onCommentFocus.bind(this)} ref={'reply'} placeholder="一起来参与讨论吧！"></textarea>
            </div>
          </div>
        }
        { hongbaoShow && hongbaoDom }
        {
          popup && <div>
            { popup === 'detail' && <PopupCourse userInfo={userInfo} course={relaCourse} onSubmit={this.onCourseSubmit.bind(this)} closePopup={this.closePopup.bind(this)} /> }
            { popup === 'hblogin' && <PopupLogin successCallback={this.closeLoginInHongbao.bind(this)} closePopup={this.closePopup.bind(this)} dispatch={dispatch} /> }
            { popup === 'orderlogin' && <PopupLogin successCallback={this.closeLoginInOrder.bind(this)} closePopup={this.closePopup.bind(this)} dispatch={dispatch} goback={this.gobackLoginInOrder.bind(this)} /> }
            { popup === 'order' && <PopupOrder paySuccessCallback={this.paySuccessCallback.bind(this)} dispatch={dispatch} coupon={coupon} course={relaCourse} closePopup={this.closePopup.bind(this)} /> }
          </div>
        }
        <Navs/>
        <div className={styles.banner}>
          {
            liveDetail && <LivePlayer 
              live={liveDetail} 
              now={now} 
              countDownInter={countDownInter} 
              PPTImg={PPTImg} 
              userInfo={userInfo}
              coupon={coupon}
              watchingPeopleNum={watchingPeopleNum}
            />
          }
          <div className={styles.switches}>
            <div 
              className={styles.item + detailClass} 
              onClick={() => this.changePage.call(this, 'detail')}>
              课程
            </div>
            <div className={styles.item + chatClass} onClick={() => this.changePage.call(this, 'chat')}>互动</div>
          </div>
        </div>
        {
          page === 'detail' && <div>
            <EnrollPanel coupon={coupon} dispatch={dispatch} live={liveDetail} userInfo={userInfo} invitor={common.invitor} />
            <div className={styles.intro}>
              <IntroPanel title={'公开课介绍'} html={liveDetail.introduce} />
            </div>
            <div className={styles.know}>
              <IntroPanel title={'公开课须知'} html={`
                <p>1、每周定期会有直播课，请持续关注；</p>
                <p>2、课程内容是直播形式，不支持回放，请在订阅后按时收听；</p>
                <p>3、本次直播课虚拟内容服务，付费用户订阅成功，概不退款，请你理解。</p>
              `} />
            </div>
          </div>
        }
        {
          page === 'chat' && assistantMsg.length > 0 && <TaComments comments={assistantMsg}/>
        }
        {
          page === 'chat' && <div className={styles.chatPage} ref={`chatPage`}>
            <Comments chats={chats} />
          </div>
        }
        { 
          page === 'chat' && <div className={styles.commentBox}>
            { 
              hbShow && couponInfo && !couponExpired ? couponDom : relaCourse ? 
              <div className={styles.ad} onClick={this.openCourceDetail.bind(this)}>
                <div className={styles.inner}>
                  <div className={styles.avatar} style={{ backgroundImage: `url(${relaCourse.bannerImg})` }}></div>
                  <div className={styles.title}>{relaCourse.title}</div>
                </div>
              </div> : null
            }
            <div className={styles.input} onClick={() => this.setReply.call(this, true)}>
              <div className={styles.pen}></div> 
              <input type="text" name="comment" placeholder="一起来参与讨论吧！" />
            </div>
          </div>
        }
        
      </div>
    );
  }
}

Live.propTypes = {
};

const mapStateToProps = (state) => {
  return { live: state.live, common: state.common, coupon: state.coupon };
}

export default connect(mapStateToProps)( withRouter(Live) );
