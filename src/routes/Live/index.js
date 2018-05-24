import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import styles from './index.less';

import { Navs, PopupCourse, PopupLogin, PopupOrder } from '../../components';

import { Icon, Input, message, Popover } from 'antd';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'videojs-contrib-hls';

import hbBg from '../../assets/hb-bg.png';
import simleLogo from '../../assets/smile.svg';

import { formatNum, getHtmlContent } from '../../utils';

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
      replying: false,
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
    const { dispatch, live } = this.props;
    const { liveDetail } = live;

    // VIP 直接调用报名接口了
    if (liveDetail.userInfo.liveVip === 'Y') {
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
      if (live.invitor && live.invitor !== getToken()) {
        dispatch({
          type: 'live/enrollFor',
          payload: {
            id: liveDetail.id,
            invitor: live.invitor,
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

  componentDidUpdate () {
    const { playerInit } = this.state;
    
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
        console.log('hwq');
      }
    });

    this.setState({
      replying: false,
    })
  }

  onCommentFocus () {
    this.refs.normal.scrollTop = 20000000;
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

  render () {
    const { live, common } = this.props;

    const { liveDetail, now, countDownInter, assistantMsg, chats } = live;

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

    const { posterShow, page, taOpen, hongbaoShow, scroll, popup, replying } = this.state;

    const detailClass = page === 'detail' ? ' ' + styles.active : '';
    const chatClass = page === 'chat' ? ' ' + styles.active : '';
    const taClass = taOpen ? ' ' + styles.open : '';

    const taComments = taOpen ? assistantMsg : assistantMsg.slice(0, 1);
    const taDom = taComments.map((d, i) => {
      let hasPic = false;
      const pubTime = moment(d.updateTime).format('YYYY-MM-DD hh:mm:ss');

      let hasPicClass = '', pic;

      const msg = d.msg || '';
      const reg = new RegExp(/<img[^>]*>/g, "g");
      const img = msg.match(reg);
      if (img && !taOpen) {
        const objE = document.createElement('div');
    　　 objE.innerHTML = img;
    　　 const imgDom = objE.childNodes[0];

        hasPicClass = ' ' + styles.hasPic;
        hasPic = true;
        pic = imgDom.src;
      }

      function createMarkup() { 
        const msg = taOpen ? d.msg || '' : getHtmlContent(d.msg || '');
        return { __html: msg }; 
      };

      return <div key={i} className={styles.item + hasPicClass}>
        <div className={styles.left}>
          <div className={styles.title}>
            <div className={styles.name}>
              <div className={styles.icon}><div className={styles.tri}></div></div>
              <div className={styles.text}>助教小燕子</div>
            </div>  
            <div className={styles.time}>{pubTime}</div>
          </div>  
          <div className={styles.comment} dangerouslySetInnerHTML={createMarkup()}></div>
        </div>
        { hasPic && <div className={styles.right} style={{ backgroundImage: `url(${pic})` }}></div> }
      </div>
    });

    const comments = chats;
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

    let invitingDom;
    if (signup === 'init') {
      invitingDom = <div className={styles.item}>
        <div className={styles.left}>
          <div className={styles.inner}>邀请5个好友可以免费</div>
        </div>
        <div className={styles.right} onClick={this.liveInviting.bind(this)}>我要免费报名</div>
      </div>;
    } else if (signup === 'inviting') {
      const invitedUserList = userInfo.invitedUserList;
      let left = 5;
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
  
    const status = liveDetail.status;
    let statusClass;
    if (status === 'ENROLLING') {
      statusClass = ' ' + styles.before;
    } else if (status === 'ONGOING') {
      statusClass = ' ' + styles.ing;
    } else if (status === 'ENDED') {
      statusClass = ' ' + styles.end;
    }

    return (
      <div className={styles.normal} ref={`normal`}>
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
            status === 'ONGOING' ? <div className={styles.player}>
              <video ref={`player`} id="my-video" className="video-js vjs-default-skin" controls preload="auto" width="100%" height="100%">
                <source src="//lv.hotelpal.cn/app/stream.m3u8" type='application/x-mpegURL' />
              </video>
            </div> : <div className={styles.player}>
              <div className={styles.split}></div>
              <div className={styles.tips}>需要报名才能观看公开课</div>
              <div className={styles.people}><span>212222人正在收看</span></div>
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
            <Popover placement="top" content={`报名即可帮助XXX获取免费报名资格`} visible={live.invitor}>
              <div className={styles.course}>
                <div className={styles.left}>
                  <div className={styles.tag + statusClass}>
                    {liveStatus[liveDetail.status]}
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
            { taComments.length > 0 && <div className={styles.ta + taClass}>
              <div>
                {taDom}
              </div>
              <div className={styles.more}>
                { taOpen && <Icon onClick={() => this.switchTa.call(this, false)} type="up" /> }
                { !taOpen && <Icon onClick={() => this.switchTa.call(this, true)} type="down" /> }
              </div>
            </div> }
            <div className={styles.comments}>
              {!taOpen && commentsDom}
            </div>
          </div>
        }
        { 
          // page === 'chat' && status === 'ONGOING' && <div className={styles.commentBox}>
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
            <div className={styles.input} onClick={() => this.setReply.call(this, true)}>
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
