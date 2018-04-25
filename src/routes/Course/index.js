import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import jdb from '../../assets/jiudianbang-big.png';
import { formatNum, getAudioLength } from '../../utils';

class Course extends Component {
  constructor (props) {
    super(props);
    this.state = {
      overflow: true,
    };
  }

  componentWillUnmount () {
    const {dispatch} = this.props;
    dispatch({
      type: 'course/reset',
    })
  }

  gotoFree (lesson) {
    location.href = `/#/lesson/pay/${lesson.id}?courseId=${this.props.course.detail.id}`;
  }

  open () {
    this.setState({
      overflow: false,
    })
  }

  render () {
    const { overflow } = this.state;
    const { course } = this.props;

    if (!course) {
      return <div></div>
    }
  
    const { detail } = course;
    if (!detail.bannerImg) {
      return <div></div>
    }

    const {lessonList} = detail;
    let freeListen;
    for (let i = 0; i < lessonList.length; i++) {
      if (lessonList[i].freeListen === 1) {
        freeListen = lessonList[i];
      }
    }

    const buyDom = !detail.purchased && <div className={styles.btns}>
      { freeListen && <div className={styles.item + ' ' + styles.free} onClick={() => {
        this.gotoFree.call(this, freeListen);
      }}>免费试听</div> }
      <div className={styles.item + ' ' + styles.buy}>订阅：¥ { detail.charge / 100 } / { detail.lessonCount }课时</div>
    </div>;

    function createMarkupTeacher() { return { __html: detail.speakerDescribe || '暂无' }; };
    function createMarkupIntroduce() { return { __html: detail.introduce || '暂无' }; };
    function createMarkupCrowd() { return { __html: detail.crowd || '暂无' }; };
    function createMarkupGain() { return { __html: detail.gain || '暂无' }; };
    function createMarkupSubscribe() { return { __html: detail.subscribe || '暂无' }; };
  
    const overflowClass = overflow ? ' ' + styles.overflow : '';

    return (
      <div className={styles.normal}>
        <div className={styles.header}>
          <img src={`${detail.bannerImg[0]}`} />
          <div className={styles.desc}>
            <div className={styles.title}>{detail.userName}</div> 
            <div className={styles.subTitle}>{detail.company} {detail.userTitle}</div>
          </div>
        </div>
        { 
          detail.purchased && <div className={styles.gotoDetail}>
            <Link to={'/coursedetail?courseId=' + detail.id}>
              <div className={styles.title}>{detail.title}</div> 
              <div className={styles.subTitle}>{detail.subtitle}</div> 
              <div className={styles.arrow}></div>
            </Link>
          </div>
        }
        {
          !detail.purchased && <div className={styles.block + ' ' + styles.teacher}>
            <div className={styles.label}>主讲人</div>
            <div className={styles.name}>
              <span className={styles.userName}>{ detail.userName }</span>
              <span className={styles.userTitle}>{ detail.company + '·' + detail.userTitle }</span>
            </div>
            <div className={styles.intro} dangerouslySetInnerHTML={createMarkupTeacher()}></div>
            <div className={styles.hr}></div>
          </div>
        }
        { 
          !detail.purchased && <div className={styles.block + ' ' + styles.courseIntro}>
            <div className={styles.label}>课程介绍</div>
            <div className={styles.intro + overflowClass} dangerouslySetInnerHTML={createMarkupIntroduce()}></div>
            {overflow && <div className={styles.open} onClick={this.open.bind(this)}>{'查看完整介绍'}</div>}
            <div className={styles.hr}></div>
          </div>
        }
        {
          !detail.purchased && <div className={styles.block + ' ' + styles.who}>
            <div className={styles.label}>适宜人群</div>
            <div className={styles.intro} dangerouslySetInnerHTML={createMarkupCrowd()}></div>
            <div className={styles.hr}></div>
          </div>
        }
        {
          !detail.purchased && <div className={styles.block + ' ' + styles.getting}>
            <div className={styles.label}>你将收获</div>
            <div className={styles.intro} dangerouslySetInnerHTML={createMarkupGain()}></div>
            <div className={styles.hr}></div>
          </div>
        }
        {
          !detail.purchased && <div className={styles.block + ' ' + styles.care}>
            <div className={styles.label}>订阅须知</div>
            <div className={styles.intro} dangerouslySetInnerHTML={createMarkupSubscribe()}></div>
            <div className={styles.hr}></div>
          </div>
        }
        <div className={styles.lessons}>
          <div className={styles.title}>课时内容</div>
          <div className={styles.list}>
            {
              detail.lessonList.map((d, i) => {
                const freeListenClass = d.freeListen === 1 ? ' ' + styles.freeListen : '';
                return <div key={i} className={styles.item}>
                  <Link to={`/lesson/pay/${d.id}?courseId=${detail.id}`}>
                    <div className={styles.up}>
                      <span className={styles.ltitle}><div className={freeListenClass}>{formatNum(d.lessonOrder)}&nbsp;|&nbsp;{d.title}</div></span> 
                      {d.freeListen === 1 && <span className={styles.tag}>免费试听</span>}
                    </div> 
                    <div className={styles.down}>
                      <p>
                        <span>{d.publishTime}</span> 
                        <span>{d.resourceSize}</span> 
                        <span>{getAudioLength(d.audioLen)}</span> 
                        {
                          d.listenLen && d.listenLen >= d.audioLen && <span className={styles.over}>已播完</span>
                        }
                        { 
                          d.listenLen && d.listenLen < d.audioLen && <span className={styles.ing}>已播{ parseInt(d.listenLen / d.audioLen * 100) }%</span>
                        }
                      </p>
                    </div> 
                    <div className={styles.arrow}></div>
                  </Link>
                </div>
              })
            }
          </div>
          <div className={styles.hr}></div>
        </div>
        <div className={styles.back}>
          <Link to={'/'}>
            <div className={styles.box}>
              <img src={jdb} /> 
              <div className={styles.title}>酒店邦成长营</div> 
              <div className={styles.desc}>为你提供高效、省时的知识服务</div> 
              <div className={styles.arrow}></div>
            </div>
          </Link>
        </div>
        {buyDom}
      </div>
    ); 
  }
}

Course.propTypes = {
};

const mapStateToProps = (state) => {
  return { course: state.course };
}

export default connect(mapStateToProps)(Course);
