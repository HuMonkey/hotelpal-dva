import React, {Component} from 'react';
import { connect } from 'dva';
import { Link, withRouter } from 'dva/router';
import styles from './index.less';

import { message } from 'antd';
import Lightbox from 'react-images';
import $ from 'zepto-modules';

import { AudioPlayer, ShareTips, PopupOrder, PopupLogin, Navs } from '../../components';
import { formatNum, getAudioLength, formatTime, getParam, strip, throttle } from '../../utils';
import hongbao4 from '../../assets/hongbao4.png';

const likedTemp = [];
let loading = false;

class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replying: false,
      paid: true,
      showAll: false,
      replyComment: null,

      orderShow: false,
      loginShow: false,
      scrollDown: false,

      previewing: false,
    };
  }

  setReply (replying, replyComment) {
    const { common, history, location } = this.props;
    const { userInfo } = common;
    if (!userInfo.phone) {
      history.push({
        pathname: '/login',
        search: `?pathname=${encodeURIComponent(location.pathname)}&search=${encodeURIComponent(location.search)}`,
      });
      return false;
    }
    this.setState({
      replying, replyComment,
    }, () => {
      replying && this.refs.reply.focus();
    });
  }

  onScroll() {
    const { location, dispatch, lesson } = this.props;
    const fromHongbao = getParam('fromHongbao', location.search);

    const scrollDown = this.state.scrollDown;
    const width = document.body.offsetWidth;
    const height = document.body.offsetHeight;
    const scrollTop = document.getElementById('root').scrollTop;

    const headerHeight = fromHongbao ? width / 10 * 2.54 : width / 10 * (4.66666);

    // 到底了
    if (this.refs.paid && (scrollTop + height >= this.refs.paid.offsetHeight) && lesson.hasMore && !loading) {
      loading = true;
      dispatch({
        type: 'lesson/fetchComments',
        payload: {
          data: {
            start: lesson.commentsStart,
            limit: 10,
            lid: lesson.detail.id,
          }
        },
        onResult() {
          loading = false
        }
      });
    }

    if (scrollTop >= headerHeight) {
      if (scrollDown === true) {
        return false;
      }
      this.setState({
        scrollDown: true,
      });
    } else {
      if (scrollDown === false) {
        return false;
      }
      this.setState({
        scrollDown: false,
      });
    }
  }

  componentWillUnmount () {
    const {dispatch} = this.props;
    dispatch({
      type: 'lesson/reset',
    })
  }

  openAll () {
    this.setState({
      showAll: true,
    })
  }

  closeAll () {
    this.setState({
      showAll: false,
    })
  }

  scrollTop () {
    this.refs.main.scrollTop = 0;
    const {dispatch} = this.props;
    dispatch({
      type: 'lesson/reset',
    })
  }

  submitComment () 
  {
    const { dispatch, lesson } = this.props;
    const { replyComment } = this.state;
    const comment = this.refs.reply.value;

    if (comment.length < 20) {
      message.error('回复至少20字以上');
      return false;
    }
    const that = this;
    dispatch({
      type: 'lesson/submitComment',
      payload: {
        data: {
          lessonId: lesson.detail.id,
          comment,
          replyToCommentId: replyComment,
        }
      },
      onResult (res) {
        if (res.data.code === 0) {
          // TODO
          that.setState({
            replying: false, replyComment: null,
          });
          dispatch({
            type: 'lesson/fetchLessonDetail',
            payload: {
              data: {
                id: lesson.detail.id,
              }
            },
            onResult() {}
          });
          message.success('发布评论成功！');
        } else {
          message.error('发布评论失败，请稍后重试~');
        }
      }
    })
  }

  addZan (comment) {
    const { dispatch, lesson } = this.props;
    if (comment.liked) {
      return false;
    }
    const lid = lesson.detail.id;
    dispatch({
      type: 'lesson/addZan',
      payload: {
        data: {
          lid, cid: comment.id,
        }
      },
      onResult (res) {
        if (res.data.code === 0) {
          // TODO
        }
      }
    })
  }

  showHongbaoTips () {
    const { lesson } = this.props;

    const { detail, courseDetail } = lesson;

    const cid = courseDetail.id;
    const lid = detail.id;
    const redPacketNonce = detail.redPacketNonce;
    
    window.location.href = `/hongbao/${lid}?courseId=${cid}&nonce=${redPacketNonce}`;
  }

  hideHongbaoTips () {
    window.history.go(-1);
  }

  onCommentFocus () {
    this.refs.normal.scrollTop = 20000000;
  }

  buyCourse () {
    const {common} = this.props;
    if (!common.userInfo.phone) {
      this.setState({
        loginShow: true,
      })
      return false;
    }
    this.setState({
      orderShow: true,
    })
  }

  loginCallback() {
    const { dispatch } = this.props;
    this.setState({
      loginShow: false,
      orderShow: true,
    });
    dispatch({
      type: 'common/fetchUserInfo',
      payload: {},
    })
  }

  showPopupOrder() {
    this.setState({
      loginShow: false,
      orderShow: true,
    })
  }

  showPopupLogin() {
    this.setState({
      loginShow: true,
    })
  }

  closePopupOrder () {
    this.setState({
      orderShow: false,
    })
  }

  closePopupLogin() {
    this.setState({
      loginShow: false,
    })
  }

  async paySuccessCallback () {
    const { dispatch, lesson } = this.props;
    this.closePopupOrder();
    dispatch({
      type: 'lesson/fetchLessonDetail',
      payload: {
        data: {
          id: lesson.detail.id,
        }
      },
      onResult () {}
    });
    dispatch({
      type: 'lesson/fetchCourseDetail',
      payload: {
        data: {
          id: lesson.courseDetail.id,
        }
      },
      onResult (res) {}
    })
  }

  componentDidMount() {
    document.getElementById('root').onscroll = throttle(this.onScroll.bind(this), 20);

    const that = this;
    $(this.refs.normal).on('click', `.${styles.article} img`, function() {
      const url = $(this).attr('src');
      if (!url) {
        return false;
      }
      that.setState({
        previewing: url
      })
    })
  }

  render () {
    const { orderShow, loginShow, scrollDown, previewing } = this.state;
    const { lesson, dispatch, coupon, history, location } = this.props;

    if (!lesson) {
      return <div className={styles.normal} ref={`normal`}></div>
    }

    const { detail, courseDetail, nextDetail, commentList, replyToCommentList } = lesson;

    const isCourse = location.pathname.split('/')[2] !== 'free';
    const isHongbao = location.pathname.indexOf('hongbao') > -1;
    const fromHongbao = getParam('fromHongbao', location.search);
    const fromHongbaoClass = fromHongbao ? ' ' + styles.fromHongbao : '';

    if (!detail || (isCourse && !courseDetail)) {
      return <div className={styles.normal} ref={`normal`}></div>
    }

    if (courseDetail && !fromHongbao && !courseDetail.purchased && !detail.freeListen) {
      return (
        <div className={styles.normal} ref={`normal`}>
          <Navs/>
          {
            orderShow && <PopupOrder 
              paySuccessCallback={this.paySuccessCallback.bind(this)} 
              dispatch={dispatch} 
              coupon={coupon} 
              course={courseDetail} 
              closePopup={this.closePopupOrder.bind(this)}  
            />
          }
          {
            loginShow && <PopupLogin 
              successCallback={this.loginCallback.bind(this)} 
              dispatch={dispatch} 
              closePopup={this.closePopupLogin.bind(this)}  
            />
          }
          <div className={styles.notPaid}>
            <div className={styles.box}>
              <div className={styles.top}>
                <div className={styles.text}>
                  你需要先购买课程<br /> 
                  <span className={styles.price}>¥ {strip(courseDetail.charge / 100)} / {courseDetail.lessonCount}课时</span>
                </div>
              </div> 
              <div className={styles.avater}>
                <div className={styles.img}>
                  <img src={courseDetail.headImg} />
                </div>
              </div> 
              <div className={styles.bottom}>
                <div className={styles.name}>{courseDetail.userName}</div> 
                <div className={styles.who}>{courseDetail.company}{courseDetail.userTitle}</div> 
                <div className={styles.course}>{courseDetail.title}</div> 
                <div className={styles.desc}>{courseDetail.subtitle}</div> 
                <div className={styles.btn} onClick={this.buyCourse.bind(this)}>购买课程  获取知识</div>
              </div>
            </div> 
            <Link to='/login/force'><div className={styles.log}>你已经购买？<span>绑定其他账号</span></div></Link>
          </div>
        </div>
      )
    }

    const { replying, showAll } = this.state;

    function createMarkup() { return { __html: detail.content }; };

    const overflow = showAll ? '' : ' ' + styles.overflow;

    const lessonList = courseDetail && courseDetail.lessonList.filter(d => d.isPublish === 1);
    const lessonsNum = lessonList ? lessonList.length : 0;
    let swiperWidth, swiperLeft;
    if (isCourse && lessonList) {
      swiperWidth = (lessonsNum * 270 + (lessonsNum - 1) * 20) / 75;
      const index = lessonList.indexOf(lessonList.find((d) => d.id == detail.id));
      swiperLeft = (index * 290) / 75 * (document.body.clientWidth / 10);
      setTimeout(() => {
        if (this.refs.lessons) {
          this.refs.lessons.scrollLeft = swiperLeft;
        }
      }, 500);
    }

    const commentDom = commentList.map((d, i) => {
      let reply;
      for (let j = 0; j < replyToCommentList.length; j++) {
        if (replyToCommentList[j].id === d.replytoId) {
          reply = replyToCommentList[j];
          break;
        }
      }
      const likedClass = d.liked || likedTemp.indexOf(d.id) > -1 ? ' ' + styles.liked : '';
      return <div className={styles.item} key={i}>
        <div className={styles.avatar} style={{ backgroundImage: `url(${d.userHeadImg})` }}></div> 
        <div className={styles.name}>
          {d.userName}  
          { (d.userCompany || d.userTitle) && <span>{d.userCompany} {d.userTitle}</span> }
          { d.isTheSpeaker === 1 && <span className={styles.tag}>主讲人</span> }
        </div> 
        <div className={styles.content}>
          { d.content }
        </div> 
        {
          reply && <div className={styles.quote}>
            {reply.userName}：{reply.content}
          </div>
        } 
        <div className={styles.bottom}>
          <div className={styles.time}>{formatTime(d.creationTime)}</div> 
          <div className={styles.box}>
            <div className={styles.comment} onClick={() => this.setReply.call(this, true, d.id)}>回复</div>
            <div className={styles.like + likedClass} onClick={() => this.addZan.call(this, d)}>
              <div className={styles.icon}></div>{d.zanCount}
            </div>
          </div>
        </div>
      </div>
    });

    const eliteCommentList = detail.eliteCommentList.commentList || [];
    const eliteReplyToCommentList = detail.commentList.replyToCommentList || [];
    const eliteCommentDom = eliteCommentList.map((d, i) => {
      let reply;
      for (let j = 0; j < eliteReplyToCommentList.length; j++) {
        if (eliteReplyToCommentList[j].id === d.replytoId) {
          reply = eliteReplyToCommentList[j];
          break;
        }
      }
      const likedClass = d.liked || likedTemp.indexOf(d.id) > -1 ? ' ' + styles.liked : '';
      return <div className={styles.item} key={i}>
        <div className={styles.avatar} style={{ backgroundImage: `url(${d.userHeadImg})` }}>  </div> 
        <div className={styles.name}>
          {d.userName}  
          { (d.userCompany || d.userTitle) && <span>{d.userCompany} {d.userTitle}</span> }
          { d.isTheSpeaker === 1 && <span className={styles.tag}>主讲人</span> }
        </div> 
        <div className={styles.content}>
          { d.content }
        </div> 
        {
          reply && <div className={styles.quote}>
            {reply.userName}：{reply.content}
          </div>
        } 
        <div className={styles.bottom}>
          <div className={styles.time}>{formatTime(d.creationTime)}</div> 
          <div className={styles.box}>
            <div className={styles.comment} onClick={() => this.setReply.call(this, true, d.id)}>回复</div>
            <div className={styles.like + likedClass} onClick={() => this.addZan.call(this, d)}>
              <div className={styles.icon}></div>{d.zanCount}
            </div>
          </div>
        </div>
      </div>
    });

    const canHongbao = isCourse && !fromHongbao && !detail.freeListen && !detail.isGift && detail.redPacketRemained > 0;
    const hongbaoClass = canHongbao ? ' ' + styles.hongbao : '';

    const nextLesson = isCourse ? lessonList && lessonList.filter(d => d.id === detail.nextLessonId)[0]
      : detail.nextLessonId;

    const isCourseClass = isCourse ? ' ' + styles.course : '';

    return (
      <div className={styles.normal} ref={`normal`}>
        {
          previewing && <Lightbox
            images={[
              { src: previewing },
            ]}
            isOpen={previewing}
            onClose={() => {
              this.setState({
                previewing: false,
              })
            }}
          />
        }
        { 
          isHongbao && <ShareTips type="hongbao" clickCallBack={this.hideHongbaoTips.bind(this)} />
        }
        { 
          !replying && <div className={styles.commentBox + hongbaoClass}>
            <div className={styles.pen}></div> 
            <input onFocus={() => this.setReply.call(this, true, null)} type="text" name="comment" placeholder="一起来参与讨论吧！" />
            { 
              canHongbao && <div className={styles.hongbao} onClick={this.showHongbaoTips.bind(this)}>
                <img src={hongbao4} />
              </div> 
            }
          </div> 
        }
        {
          replying && <div className={styles.replyBox}>
            <div className={styles.cover} onClick={() => this.setReply.call(this, false, null)}></div> 
            <div className={styles.box}>
              <div className={styles.btns}>
                <div className={styles.cancel} onClick={() => this.setReply.call(this, false, null)}>取消</div> 
                <div className={styles.confirm} onClick={this.submitComment.bind(this)}>发布</div>
              </div> 
              <textarea onFocus={this.onCommentFocus.bind(this)} ref={'reply'} placeholder="一起来参与讨论吧！"></textarea>
            </div>
          </div>
        }
        <div className={styles.paid + fromHongbaoClass + isCourseClass} ref={`paid`}>
          <div className={styles.audioPlayer}>
            <AudioPlayer 
              scrollDown={(!isCourse || fromHongbao) && scrollDown}
              free={detail.freeListen} 
              fromHongbao={fromHongbao || detail.isGift} 
              dispatch={dispatch} 
              lid={detail.id} 
              nextLesson={nextLesson} 
              courseId={courseDetail && courseDetail.id} 
              nextDetail={nextDetail}
              isCourse={isCourse} 
              audioUrl={detail.audio} 
              previous={detail.previousLessonId} 
              next={detail.nextLessonId}
              coverImg={detail.coverImg}
              listenLen={detail.listenLen}
              audioLen={detail.audioLen}
            >
            </AudioPlayer>
          </div>
          <div className={styles.main} ref={`main`}>
            {!isCourse && scrollDown && <div className={styles.interCourseBlank}></div>}
            {fromHongbao && scrollDown && <div className={styles.fromHongbaoBlank}></div>}
            <div className={styles.courseTitle}>{isCourse && (formatNum(detail.lessonOrder))}{isCourse && <span>&nbsp;|&nbsp;</span>}{detail.title}</div>
            <div className={styles.infos}>
              <div className={styles.time}>{detail.publishTime} 发布</div>
              <div className={styles.other}>
                <span>
                  <div className={styles.icon + ' ' + styles.time}></div>
                  {getAudioLength(detail.audioLen)}
                </span> 
                <span>
                  <div className={styles.icon + ' ' + styles.download}></div>
                  {detail.resourceSize}
                </span> 
                <span>
                  <div className={styles.icon + ' ' + styles.read}></div>
                  {detail.commentList.count || 0}
                </span>
              </div>
            </div>
            <div className={styles.content}>
              <div 
                className={styles.article + overflow} 
                dangerouslySetInnerHTML={createMarkup()}
              >
              </div>
              { !showAll && <div className={styles.open} onClick={this.openAll.bind(this)}>查看完整介绍</div> }
              { showAll && <div className={styles.open} onClick={this.closeAll.bind(this)}>收起完整介绍</div> }
              {
                isCourse && <div>
                  <div className={styles.hr}></div>
                  <div className={styles.course}>
                    <div className={styles.back}>
                      <Link to={`/course/${courseDetail.id}`}>
                        <div className={styles.box}>
                          <div className={styles.img} style={{ backgroundImage: `url(${courseDetail.headImg})` }}></div> 
                          <div className={styles.title}>{courseDetail.title}</div> 
                          <div className={styles.desc}>{courseDetail.userName} · {courseDetail.company} {courseDetail.userTitle}</div> 
                          <div className={styles.arrow}></div>
                        </div>
                      </Link>
                    </div> 
                    <div className={styles.hr}></div> 
                    <div className={styles.lessons} ref={`lessons`}>
                      <div className={styles.swiper} style={{ width: swiperWidth + 'rem' }}>
                        {
                          courseDetail.lessonList && courseDetail.lessonList.filter(d => d.isPublish === 1).map((d, i) => {
                            let currentClass = d.id === detail.id ? ' ' + styles.current : '';
                            return <div key={i} className={styles.item + currentClass} onClick={() => {
                              this.scrollTop.call(this);
                              history.push({
                                pathname: `/lesson/pay/${d.id}`,
                                search: `?courseId=${courseDetail.id}`
                              })
                            }}>
                              <div className={styles.inner}>{formatNum(d.lessonOrder)} | {d.title}</div>
                            </div>
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className={styles.discussBlank}></div>
            </div>
          </div>
          <div className={styles.discuss}>
            {
              eliteCommentDom.length > 0 && <div className={styles.good}>
                <div className={styles.title}>精选讨论</div>
                <div className={styles.comments}>
                  { eliteCommentDom }
                </div>
              </div> 
            }
            <div className={styles.all}>
              <div className={styles.title}>全部讨论</div>
              {
                commentDom.length > 0 ? <div className={styles.comments}>
                  {commentDom}
                </div> : <div className={styles.noComments}>
                  尚无讨论，说说你的看法吧！
                </div>
              }
            </div>
          </div> 
        </div>
      </div>
    );
  }
}

Lesson.propTypes = {
};

const mapStateToProps = (state) => {
  return { lesson: state.lesson, coupon: state.coupon, common: state.common };
}

export default connect(mapStateToProps)(withRouter(Lesson));
