import React, {Component} from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './index.less';

import cross from '../../assets/cross.png';
import { message } from 'antd';
import { formatNum, getAudioLength, courseMemberCardUseful } from '../../utils';
import { CourseContent, BackBtn, PopupOrder, PopupLogin } from '../../components';

class Course extends Component {
  constructor (props) {
    super(props);
    this.state = {
      freeTipsShow: true,
      orderPopupShow: false,
      loginPopupShow: false,
    };
  }

  closeFreeTips () {
    this.setState({
      freeTipsShow: false,
    })
  }

  componentWillUnmount () {
    const {dispatch} = this.props;
    dispatch({
      type: 'course/reset',
    })
  }

  gotoFree (lesson) {
    location.href = `/?courseId=${this.props.course.detail.id}#/lesson/pay/${lesson.id}`;
  }

  async buyCourse () {
    const { common, history } = this.props;
    if (!common.userInfo.phone) {
      // 弹出注册框
      this.setState({
        loginPopupShow: true,
      })
      return false;
    }
    this.showOrderPopup();
  }

  showOrderPopup () {
    this.setState({
      orderPopupShow: true,
    })
  }

  closePopup () {
    this.setState({
      orderPopupShow: false,
    })
  }

  gotoDetail () {
    const { course } = this.props;
    location.href = `/?courseId=${course.detail.id}#/coursedetail`;
  }

  paySuccessCallback() {
    const { dispatch, course } = this.props;
    message.info('我在回调里面！！');
    this.setState({
      orderPopupShow: false,
    });
    dispatch({
      type: 'course/fetchCourseDetail',
      payload: {
        data: {
          id: course.detail.id,
        }
      },
      onResult (res) {}
    });
  }

  loginCallback() {
    const { dispatch } = this.props;
    this.setState({
      loginPopupShow: false,
      orderPopupShow: true,
    });
    dispatch({
      type: 'common/fetchUserInfo',
      payload: {},
    })
  }

  render () {
    const { freeTipsShow, orderPopupShow, loginPopupShow } = this.state;
    const { course, common, coupon, dispatch } = this.props;

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

    const card = courseMemberCardUseful(coupon.card) ? card : null;

    const buyDom = !detail.purchased && <div className={styles.btns}>
      { freeListen ? <div className={styles.item + ' ' + styles.free} onClick={() => {
        this.gotoFree.call(this, freeListen);
      }}>免费试听</div> : null }
      <div className={styles.item + ' ' + styles.buy} onClick={this.buyCourse.bind(this)}>
        {
          detail.charge / 100 < 500 
            && card 
            && <div className={styles.freeBubble}>
            <div className={styles.arrow}></div>
            <div className={styles.inner}>点击可免费兑换课程</div>
          </div>
        }
        订阅：¥ { detail.charge / 100 } { detail.lessonCount && <span>/ { detail.lessonCount }课时</span> }
      </div>
    </div>;

    const freeChanceDom = !detail.purchased && detail.charge / 100 < 500 
      && card
      && freeTipsShow
      && <div className={styles.freeTips}>
        亲爱的内邀用户，你有{ leftTimes.leftTimes }个老师课程可以免费学习
        <img src={cross} onClick={this.closeFreeTips.bind(this)}/>
      </div>

    return (
      <div className={styles.normal}>
        {freeChanceDom}
        { orderPopupShow && <PopupOrder dispatch={dispatch} coupon={coupon} course={detail} paySuccessCallback={this.paySuccessCallback.bind(this)} closePopup={this.closePopup.bind(this)} /> }
        { loginPopupShow && <PopupLogin dispatch={dispatch} closePopup={this.loginCallback.bind(this)} /> }
        <div className={styles.header}>
          <img src={`${detail.bannerImg[0]}`} />
          <div className={styles.desc}>
            <div className={styles.title}>{detail.userName}</div> 
            <div className={styles.subTitle}>{detail.company} {detail.userTitle}</div>
          </div>
          { detail.status === 0 && <div className={styles.coming}>预告</div> }
        </div>
        { 
          detail.purchased && <div className={styles.gotoDetail} onClick={this.gotoDetail.bind(this)}>
              <div className={styles.title}>{detail.title}</div> 
              <div className={styles.subTitle}>{detail.subtitle}</div> 
              <div className={styles.arrow}></div>
          </div>
        }
        {
          !detail.purchased && <CourseContent course={detail}></CourseContent>
        }
        <div className={styles.lessons}>
          <div className={styles.title}>课时内容</div>
          <div className={styles.list}>
            {
              detail.lessonList.map((d, i) => {
                const freeListenClass = d.freeListen === 1 ? ' ' + styles.freeListen : '';
                const futureClass = !d.isPublish ? ' ' + styles.future : '';
                const finishedClass = d.listenLen && d.listenLen >= d.audioLen ? ' ' + styles.finished : '';
                return <div key={i} className={styles.item + futureClass + finishedClass} onClick={() => {
                  if (!d.isPublish) {
                    return false;
                  }
                  location.href = `/?courseId=${detail.id}#/lesson/pay/${d.id}`;
                }}>
                  <div className={styles.up}>
                    <span className={styles.ltitle}><div className={freeListenClass}>{formatNum(d.lessonOrder)}&nbsp;|&nbsp;{d.title}</div></span> 
                    {d.freeListen === 1 && <span className={styles.tag}>免费试听</span>}
                  </div> 
                  {
                    d.isPublish ? <div className={styles.down}>
                      <div>
                        <span>{d.publishTime}</span> 
                        <span>{d.resourceSize}</span> 
                        <span>{getAudioLength(d.audioLen)}</span> 
                        {
                          d.listenLen && d.listenLen >= d.audioLen ? <span className={styles.over}>已播完</span> : null
                        }
                        { 
                          d.listenLen && d.listenLen < d.audioLen ? <span className={styles.ing}>已播{ parseInt(d.listenLen / d.audioLen * 100) }%</span> : null
                        }
                      </div>
                    </div> : <div className={styles.down}>
                        尚未发布
                    </div>
                  }
                  { d.isPublish ? <div className={styles.arrow}></div> : null }
                </div>
              })
            }
          </div>
          <div className={styles.hr}></div>
        </div>
        <BackBtn />
        {buyDom}
      </div>
    ); 
  }
}

Course.propTypes = {
};

const mapStateToProps = (state) => {
  return { course: state.course, common: state.common, coupon: state.coupon };
}

export default connect(mapStateToProps)(withRouter(Course));
