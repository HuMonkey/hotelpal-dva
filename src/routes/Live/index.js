import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './index.less';

import { Navs, PopupCourse, PopupLogin, PopupOrder, 
  IntroPanel, EnrollPanel, TaComments, Comments, LivePlayer } from '../../components';

import { message } from 'antd';

// import 'video.js/dist/video-js.css';
// import videojs from 'video.js';
// import 'videojs-contrib-hls';

import hbBg from '../../assets/hb-bg.png';

import { getHtmlContent, configWechat, updateWechartShare } from '../../utils';

let initFlag = false;
let interval;

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hongbaoShow: false,
      page: 'detail', // detail or chat
      // signup: 'init', // inviting init paid vip free
      // state: 'ing', // before ing after
      popup: null, // detail, order, login
      // playerInit: false,
      replying: false,

      enrollForShow: true,

      hbCountDown: moment(),
    };
  }

  scrollToBottom () {
    document.getElementById('root').scrollTop = 20000000;
  }

  scrollToTop () {
    document.getElementById('root').scrollTop = 0;
  }

  showHongbao () {
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

  openHongbao () {
    const { dispatch, live } = this.props;

    dispatch({
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

  componentDidUpdate (prevProps) {
    const chats = this.props.live && this.props.live.chats;
    const prevChats = prevProps.live && prevProps.live.chats;

    if (((prevChats && prevChats.length)) !== (chats && chats.length)) {
      this.scrollToBottom();
    }

    const { live } = this.props;
    const { liveDetail } = live;

    if (!initFlag && liveDetail) {
      initFlag = true;
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
    const { dispatch } = this.props;

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
        popup: 'login',
      });
      return false;
    }
    this.setState({
      popup: 'order',
    })
  }

  async updateWechatShare () {
    const { dispatch, live } = this.props;
    const { liveDetail } = live;

    const dict = {
      title: liveDetail.title,
      link: location.href,
      imgUrl: liveDetail.bannerImg || 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: getHtmlContent(liveDetail.introduce),
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
            updateWechartShare(dict);
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
    this.closePopup();
  }

  render () {
    const { live, common, dispatch, coupon } = this.props;

    const { liveDetail, couponInfo, now, countDownInter, assistantMsg, chats, hbShow, PPTImg, watchingPeopleNum } = live;

    if (!liveDetail) {
      return <div></div>
    }

    const userInfo = Object.assign({}, common.userInfo, liveDetail.userInfo);

    const { relaCourse } = liveDetail;

    const { page, hongbaoShow, popup, replying, hbCountDown } = this.state;

    const detailClass = page === 'detail' ? ' ' + styles.active : '';
    const chatClass = page === 'chat' ? ' ' + styles.active : '';

    const hongbaoDom = couponInfo && <div className={styles.hb}>
      <div className={styles.main} style={{ backgroundImage: `url(${hbBg})` }}>
        <div className={styles.price}>￥<span>{couponInfo.value / 100}</span></div>
        <div className={styles.btn} onClick={this.openHongbao.bind(this)}>抢</div>
      </div>
      <div className={styles.close} onClick={this.hideHongbao.bind(this)}></div>
    </div>;

    const openTime = moment(liveDetail.openTime);
    const diffTime = openTime - now;
    // const duration = moment.duration(diffTime, 'milliseconds');
    if (diffTime <= 0) {
      clearInterval(countDownInter);
    }

    const isChatPageClass = page === 'chat' ? ' ' + styles.chat : '';
    const hasAssistClass = assistantMsg.length > 0 ? ' ' + styles.hasAssist : '';

    // 红包倒计时
    let hbCountDownStr = '';
    if (couponInfo) {
      const expired = moment(couponInfo.validity);
      console.log(expired - hbCountDown);
    }

    return (
      <div className={styles.normal + isChatPageClass + hasAssistClass} ref={`normal`}>
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
            { popup === 'detail' && <PopupCourse course={relaCourse} onSubmit={this.onCourseSubmit.bind(this)} closePopup={this.closePopup.bind(this)} /> }
            { popup === 'login' && <PopupLogin closePopup={this.closePopup.bind(this)} /> }
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
            <EnrollPanel coupon={coupon} dispatch={dispatch} live={liveDetail} userInfo={userInfo} invitor={live.invitor} />
            <div className={styles.intro}>
              <IntroPanel title={'公开课介绍'} html={liveDetail.introduce} />
            </div>
            <div className={styles.know}>
              <IntroPanel title={'公开课须知'} html={`公开课没有回放，付费用户请按时收看，错过不予退款。`} />
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
              hbShow && couponInfo ? <div className={styles.hongbao} onClick={this.showHongbao.bind(this)}>
                <div className={styles.inner}>
                  <div className={styles.square}>
                    <div className={styles.money}>￥<span>{couponInfo.value / 100}</span></div>
                    <div className={styles.btn}>抢</div>
                    <div className={styles.time}>11:12:15</div>
                  </div>
                  <div className={styles.bubble1}></div>
                  <div className={styles.bubble2}></div>
                  <div className={styles.bubble3}></div>
                  <div className={styles.bubble4}></div>
                </div>
              </div> : relaCourse && userInfo.relateCoursePurchased === 'N' ? <div className={styles.ad} onClick={this.openCourceDetail.bind(this)}>
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
