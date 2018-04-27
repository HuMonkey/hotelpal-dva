import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import { AudioPlayer } from '../../components';
import { formatNum, getAudioLength, formatTime } from '../../utils';
import hongbao4 from '../../assets/hongbao4.png';
import { replace } from 'react-router-redux';

const likedTemp = [];

class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replying: false,
      paid: true,
      showAll: false,
      replyComment: null,
    };
  }

  setReply (replying, replyComment) {
    this.setState({
      replying, replyComment,
    }, () => {
      replying && this.refs.reply.focus();
    });
  }

  componentDidMount () {}

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

  scrollTop () {
    this.refs.main.scrollTop = 0;
    const {dispatch} = this.props;
    dispatch({
      type: 'lesson/reset',
    })
  }

  submitComment () {
    const { dispatch, lesson } = this.props;
    const { replyComment } = this.state;
    const comment = this.refs.reply.value;

    if (comment.length < 20) {
      alert('回复至少20字以上');
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
          });
          alert('发布评论成功！');
        } else {
          alert('发布评论失败，请稍后重试~');
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
          dispatch({
            type: 'lesson/fetchLessonDetail',
            payload: {
              data: {
                id: lid,
              }
            },
          });
        }
      }
    })
  }

  render () {
    const { lesson, dispatch } = this.props;
    if (!lesson) {
      return <div></div>
    }

    const { detail, courseDetail } = lesson;

    const route = location.hash;
    const isCourse = location.hash.split('/')[2] !== 'free';

    if (!detail || (isCourse && !courseDetail)) {
      return <div></div>
    }

    if (courseDetail && !courseDetail.purchased && !detail.freeListen) {
      return (
        <div className={styles.normal}>
          <div className={styles.notPaid}>
            <div className={styles.box}>
              <div className={styles.top}>
                <div className={styles.text}>
                  你需要先购买课程<br /> 
                  <span className={styles.price}>¥ {Math.round(courseDetail.charge / 100)} / {courseDetail.lessonCount}课时</span>
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
                <div className={styles.btn}>购买课程  获取知识</div>
              </div>
            </div> 
            <div className={styles.log}>你已经购买？<span>绑定其他账号</span></div>
          </div>
        </div>
      )
    }

    const { replying, showAll } = this.state;

    function createMarkup() { return { __html: detail.content }; };

    const overflow = showAll ? '' : ' ' + styles.overflow;

    const lessonList = courseDetail && courseDetail.lessonList;
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

    const commentList = detail.commentList.commentList;
    const replyToCommentList = detail.commentList.replyToCommentList;
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
        <div className={styles.avatar}>
          <img src={d.userHeadImg} />
        </div> 
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

    const eliteCommentList = detail.eliteCommentList.commentList;
    const eliteReplyToCommentList = detail.commentList.replyToCommentList;
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
        <div className={styles.avatar}>
          <img src={d.userHeadImg} />
        </div> 
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

    const canHongbao = isCourse && !detail.freeListen && !lesson.isGift && detail.redPacketRemained > 0;
    const hongbaoClass = canHongbao ? ' ' + styles.hongbao : '';

    const nextLesson = lessonList && lessonList.filter(d => d.id === detail.nextLessonId)[0];

    return (
      <div className={styles.normal} ref={`main`}>
        <AudioPlayer dispatch={dispatch} lid={detail.id} nextLesson={nextLesson && nextLesson.title} courseId={courseDetail && courseDetail.id} isCourse={isCourse} audioUrl={detail.audio} previous={detail.previousLessonId} next={detail.nextLessonId}></AudioPlayer>
        { 
          !replying && <div className={styles.commentBox + hongbaoClass}>
            <div className={styles.pen}></div> 
            <input onFocus={() => this.setReply.call(this, true, null)} type="text" name="comment" placeholder="一起来参与讨论吧！" />
            { 
              canHongbao && <div className={styles.hongbao}>
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
              <textarea ref={'reply'} placeholder="一起来参与讨论吧！"></textarea>
            </div>
          </div>
        }
        <div className={styles.paid}>
          <div className={styles.main}>
            <div className={styles.courseTitle}>{formatNum(detail.lessonOrder)}&nbsp;|&nbsp;{detail.title}</div>
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
              {
                isCourse && <div>
                  <div className={styles.hr}></div>
                  <div className={styles.course}>
                    <div className={styles.back}>
                      <Link to={`/course/${courseDetail.id}`}>
                        <div className={styles.box}>
                          <div className={styles.img}>
                            <img src={courseDetail.bannerImg && courseDetail.bannerImg[0]} />
                          </div> 
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
                          courseDetail.lessonList && courseDetail.lessonList.map((d, i) => {
                            let currentClass = d.id === detail.id ? ' ' + styles.current : '';
                            return <div key={i} className={styles.item + currentClass} onClick={this.scrollTop.bind(this)}>
                              <Link to={`/lesson/pay/${d.id}?courseId=${courseDetail.id}`}>
                                <div className={styles.inner}>{formatNum(d.lessonOrder)} | {d.title}</div>
                              </Link>
                            </div>
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
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
        </div>
      </div>
    );
  }
}

Lesson.propTypes = {
};

const mapStateToProps = (state) => {
  return { lesson: state.lesson };
}

export default connect(mapStateToProps)(Lesson);
