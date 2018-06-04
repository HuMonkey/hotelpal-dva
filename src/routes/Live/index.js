import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import styles from './index.less';

import { Navs, PopupCourse, PopupLogin, PopupOrder, IntroPanel, EnrollPanel, TaComments } from '../../components';

import { Icon, Input, message, Popover } from 'antd';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'videojs-contrib-hls';

import hbBg from '../../assets/hb-bg.png';
import simleLogo from '../../assets/smile.svg';

import { formatNum, getHtmlContent } from '../../utils';

let helpedTipsShow = false; // "是否帮助过别人的提示"
let commentScroll = false; // 评论框滚动到最下面

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hongbaoShow: false,
      page: 'detail', // detail or chat
      // signup: 'init', // inviting init paid vip free
      // state: 'ing', // before ing after
      popup: null, // detail, order, login
      playerInit: false,
      replying: false,

      enrollForShow: true,
    };
  }

  scrollToBottom () {
    document.getElementById('root').scrollTop = 20000000;
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
    }, () => {
      this.scrollToBottom();
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

  componentDidUpdate (prevProps, prevState) {
    const { playerInit } = this.state;

    const chats = this.props.live && this.props.live.chats;
    const prevChats = prevProps.live && prevProps.live.chats;

    if (((prevChats && prevChats.length)) !== (chats && chats.length)) {
      this.scrollToBottom();
    }
    
    if (playerInit || !this.refs.player) {
      return false;
    }

    videojs('my-video');

    this.setState({
      playerInit: true,
    })
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
    await dispatch({
      type: 'live/addComment',
      payload: {
        data: {
          msg: reply,
        }
      },
      onResult () {
        message.success('成功发布评论~');
      }
    });

    this.setState({
      replying: false,
    })
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

  componentWillUnmount () {
    const {dispatch} = this.props;
    dispatch({
      type: 'live/reset',
    })
  }

  render () {
    const { enrollForShow } = this.state;
    const { live, common, dispatch } = this.props;

    const { liveDetail, now, countDownInter, assistantMsg, chats, hbShow, PPTImg } = live;

    if (!liveDetail) {
      return <div></div>
    }

    const userInfo = Object.assign({}, common.userInfo, liveDetail.userInfo);

    const { relaCourse } = liveDetail;

    const { page, taOpen, hongbaoShow, popup, replying } = this.state;

    const detailClass = page === 'detail' ? ' ' + styles.active : '';
    const chatClass = page === 'chat' ? ' ' + styles.active : '';

    const comments = chats.sort((a, b) => {
      return a.updateTime - b.updateTime;
    });
    const commentsDom = comments.map((d, i) => {
      const isMine = (d.self === 'Y');
      const isMineClass = isMine ? ' ' + styles.mine : '';
      const name = `${d.user.nick} ${d.user.company || ''} ${d.user.title || ''}`;

      function createMarkup() { return { __html: d.msg || '' }; };

      return <div className={styles.item + isMineClass} key={i}>
        <div className={styles.avatar} style={{ backgroundImage: `url(${d.user.headImg})` }}></div>
        <div className={styles.main}>
          <div className={styles.name}>{name}</div>
          <div className={styles.talk}>
            <div className={styles.inner} dangerouslySetInnerHTML={createMarkup()}></div>
            <div className={styles.arrow}></div>
          </div>
        </div>
      </div>
    })

    const hongbaoDom = <div className={styles.hb}>
      <div className={styles.main} style={{ backgroundImage: `url(${hbBg})` }}>
        <div className={styles.price}>￥<span>20</span></div>
        <div className={styles.btn} onClick={this.openHongbao.bind(this)}>抢</div>
      </div>
      <div className={styles.close} onClick={this.closeHongbao.bind(this)}></div>
    </div>;

    const openTime = moment(live.openTime);
    const diffTime = openTime - now;
    const duration = moment.duration(diffTime, 'milliseconds');
    if (diffTime <= 0) {
      clearInterval(countDownInter);
    }

    const isChatPageClass = page === 'chat' ? ' ' + styles.chat : '';
    return (
      <div className={styles.normal + isChatPageClass}>
        {
          replying && <div className={styles.replyBox}>
            <div className={styles.cover} onClick={() => this.setReply.call(this, false)}></div> 
            <div className={styles.box}>
              <div className={styles.btns}>
                <div className={styles.cancel} onClick={() => this.setReply.call(this, false)}>取消</div> 
                <div className={styles.confirm} onClick={this.submitComment.bind(this)}>发布</div>
              </div> 
              <textarea onFocus={this.onCommentFocus.bind(this)} ref={'reply'} placeholder="一起来参与讨论吧！"></textarea>
            </div>
          </div>
        }
        { hongbaoShow && hongbaoDom }
        {
          popup && <div>
            { popup === 'detail' && <PopupCourse course={relaCourse} onSubmit={this.onCourseSubmit.bind(this)} closePopup={this.closePopup.bind(this)} /> }
            { popup === 'login' && <PopupLogin closePopup={this.closePopup.bind(this)} /> }
            { popup === 'order' && <PopupOrder course={relaCourse} closePopup={this.closePopup.bind(this)} /> }
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
          { 
            userInfo.enrolled === 'Y' && status === 'ONGOING' ? <div className={styles.player}>
              <div className={styles.ppt}>
                <img src={PPTImg} />
              </div>
              <video ref={`player`} id="my-video" className="video-js vjs-default-skin" controls preload="auto" width="100%" height="100%">
                <source src="//lv.hotelpal.cn/app/stream.m3u8" type='application/x-mpegURL' />
              </video>
            </div> : <div className={styles.player}>
              <div className={styles.split}></div>
              <div className={styles.tips}>需要报名才能观看公开课</div>
              {status === 'ONGOING' && <div className={styles.people}><span>{liveDetail.totalPeople}人正在收看</span></div>}
            </div>
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
            <EnrollPanel dispatch={dispatch} live={liveDetail} userInfo={userInfo} invitor={live.invitor} />
            <div className={styles.intro}>
              <IntroPanel title={'公开课介绍'} html={liveDetail.introduce} />
            </div>
            <div className={styles.know}>
              <IntroPanel title={'公开课须知'} html={`公开课没有回放，付费用户请按时收看，错过不予退款。`} />
            </div>
          </div>
        }
        {/* { 
          page === 'chat' && taComments.length > 0 && <div className={styles.ta + taClass}>
            <div>
              {taDom}
            </div>
            <div className={styles.more}>
              { taOpen && <Icon onClick={() => this.switchTa.call(this, false)} type="up" /> }
              { !taOpen && <Icon onClick={() => this.switchTa.call(this, true)} type="down" /> }
            </div>
          </div> 
        } */}
        {
          page === 'chat' && assistantMsg.length > 0 && <TaComments comments={assistantMsg}/>
        }
        {
          page === 'chat' && <div className={styles.chatPage} ref={`chatPage`}>
            <div className={styles.comments} ref={`comments`}>
              {!taOpen && commentsDom}
            </div>
          </div>
        }
        { 
          page === 'chat' && <div className={styles.commentBox}>
            { 
              hbShow ? <div className={styles.hongbao} onClick={this.openHongbao.bind(this)}>
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
              </div> : relaCourse ? <div className={styles.ad} onClick={this.openCourceDetail.bind(this)}>
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
  return { live: state.live, common: state.common };
}

export default connect(mapStateToProps)(Live);
