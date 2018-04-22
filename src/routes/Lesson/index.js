import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { AudioPlayer } from '../../components';
import { formatNum, getAudioLength } from '../../utils';
import hongbao4 from '../../assets/hongbao4.png';

class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replying: false,
      paid: true,
      showAll: false,
    };
  }

  setReply (replying) {
    this.setState({
      replying,
    })
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

  render () {
    const { lesson } = this.props;
    if (!lesson) {
      return <div></div>
    }

    const { detail } = lesson;
    console.log(detail);
    if (!detail.audio) {
      return <div></div>
    }

    const route = location.hash;
    const isCourse = location.hash.split('/')[2] !== 'free';

    const { replying, paid, showAll } = this.state;

    if (isCourse && !paid) {
      return (
        <div className={styles.normal}>
          <div className={styles.notPaid}>
            <div className={styles.box}>
              <div className={styles.top}>
                <div className={styles.text}>
                  你需要先购买课程<br /> 
                  <span className={styles.price}>¥ 99 / 7课时</span>
                </div>
              </div> 
              <div className={styles.avater}>
                <div className={styles.img}>
                  <img src="http://img.hotelpal.cn/1505472718419.jpg" />
                </div>
              </div> 
              <div className={styles.bottom}>
                <div className={styles.name}>金杜</div> 
                <div className={styles.who}>宛若故里 创始人</div> 
                <div className={styles.course}>民宿创业的七条军规</div> 
                <div className={styles.desc}>1000万学费买来的经验</div> 
                <div className={styles.btn}>购买课程  获取知识</div>
              </div>
            </div> 
            <div className={styles.log}>你已经购买？<span>绑定其他账号</span></div>
          </div>
        </div>
      )
    }

    function createMarkup() { return { __html: detail.content }; };

    const overflow = showAll ? '' : ' ' + styles.overflow;

    return (
      <div className={styles.normal}>
        <AudioPlayer audioUrl={detail.audio}></AudioPlayer>
        { 
          !replying && <div className={styles.commentBox + ' ' + styles.hongbao}>
            <div className={styles.pen}></div> 
            <input onFocus={() => this.setReply.call(this, true)} type="text" name="comment" placeholder="一起来参与讨论吧！" />
            { 
              isCourse && <div className={styles.hongbao}>
                <img src={hongbao4} />
              </div> 
            }
          </div> 
        }
        {
          replying && <div className={styles.replyBox}>
            <div className={styles.cover}></div> 
            <div className={styles.box}>
              <div className={styles.btns}>
                <div className={styles.cancel} onClick={() => this.setReply.call(this, false)}>取消</div> 
                <div className={styles.confirm}>发布</div>
              </div> 
              <textarea placeholder="一起来参与讨论吧！"></textarea>
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
                      <div className={styles.box}>
                        <div className={styles.img}>
                          <img src="http://img.hotelpal.cn/1509937424911.jpg" />
                        </div> 
                        <div className={styles.title}>酒店电商万能公式从0到1</div> 
                        <div className={styles.desc}>葛健 · 酒店哥 CEO</div> 
                        <div className={styles.arrow}></div>
                      </div>
                    </div> 
                    <div className={styles.hr}></div> 
                    <div className={styles.lessons}>
                      <div className={styles.swiper}>
                        <div className={styles.item}>
                          <div className={styles.inner}>01 | 什么是酒店电商万能公式？</div>
                        </div>
                        <div className={styles.item}>
                          <div className={styles.inner}>01 | 什么是酒店电商万能公式？</div>
                        </div>
                        <div className={styles.item}>
                          <div className={styles.inner}>01 | 什么是酒店电商万能公式？</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className={styles.discuss}>
                <div className={styles.all}>
                  <div className={styles.title}>全部讨论</div>
                  <div className={styles.comments}>
                    <div className={styles.item}>
                      <div className={styles.avatar}>
                        <img src="http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJeYou1lgwzmjtF8QLz9Tr3bicNiazUkic8xr8yzic2tVuxl12dibDz59MxmYRvUstQfiavwW0CSYWMfpHA/0" />
                      </div> 
                      <div className={styles.name}>
                        葛健  
                        <span>酒店哥 创始人</span> 
                        <span className={styles.tag}>主讲人</span>
                      </div> 
                      <div className={styles.content}>
                        单体酒店更加容易做知名度，因为相比连锁品牌的各种条条框框，单体酒店更加灵活更加没有包袱，如何关于如何提升品牌知名度，在第5节课
                      </div> 
                      <div className={styles.quote}>
                        当家的：单体酒店没有品牌影响力。比如光大银行下的酒店，是不是酒店名前冠光大俩字，就会提升知名度了？
                      </div> 
                      <div className={styles.bottom}>
                        <div className={styles.time}>4个月前</div> 
                        <div className={styles.box}>
                          <div className={styles.comment}>回复</div>
                          <div className={styles.like}>
                            <div className={styles.icon}></div>3
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
