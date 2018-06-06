import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import cross from '../../assets/cross.png';
import { formatNum, getAudioLength, callWxPay } from '../../utils';
import { CourseContent, BackBtn } from '../../components';

class Course extends Component {
  constructor (props) {
    super(props);
    this.state = {
      freeTipsShow: true,
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

  async createOrder () {
    const { dispatch, course, common } = this.props;
    const { detail } = course;
    let result;
    await dispatch({
      type: 'course/createPayOrder',
      payload: {
        data: {
          id: detail.id,
        }
      },
      onResult (res) {
        result = res;
      }
    });
    if (result.data.code === 0) {
      const data = result.data.data;
      const pk = data.package;
      const { appId, nonceStr, paySign, timeStamp, tradeNo } = data;
      callWxPay({
        pk, appId, nonceStr, paySign, timeStamp, tradeNo
      }, (res) => {
        console.log('支付成功！', res);
      })
    } else {
      alert(result.data.msg);
    }
  }

  async buyCourse () {
    const { dispatch, course, common } = this.props;
    const { detail } = course;
    const { userInfo } = common;

    // 免费兑换
    if (detail.charge / 100 < 500 && common.userInfo && common.userInfo.freeCourseRemained > 0) {
      const useFree = confirm('将使用一次免费获取课程的机会，确认兑换？');
      if (useFree) {
        let result;
        await dispatch({
          type: 'course/getFreeCourse',
          payload: {
            data: {
              id: detail.id,
            }
          },
          onResult (res) {
            result = res;
          }
        });
        if (result.data.code === 0) {
          dispatch({
            type: 'course/fetchCourseDetail',
            payload: {
              data: {
                id: detail.id,
              }
            },
            onResult (res) {
              console.log(res)
            }
          });
        }
      } else {
        this.createOrder();
      }
      return false;
    }
    this.createOrder();
  }

  gotoDetail () {
    const { course } = this.props;
    location.href = `/?courseId=${course.detail.id}#/coursedetail`;
  }

  render () {
    const { freeTipsShow } = this.state;
    const { course, common } = this.props;

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
      { freeListen ? <div className={styles.item + ' ' + styles.free} onClick={() => {
        this.gotoFree.call(this, freeListen);
      }}>免费试听</div> : null }
      <div className={styles.item + ' ' + styles.buy} onClick={this.buyCourse.bind(this)}>
        {
          detail.charge / 100 < 500 
            && common.userInfo 
            && common.userInfo.freeCourseRemained > 0 
            && <div className={styles.freeBubble}>
            <div className={styles.arrow}></div>
            <div className={styles.inner}>点击可免费兑换课程</div>
          </div>
        }
        订阅：¥ { detail.charge / 100 } { detail.lessonCount && <span>/ { detail.lessonCount }课时</span> }
      </div>
    </div>;

    const freeChanceDom = !detail.purchased && detail.charge / 100 < 500 
      && common.userInfo 
      && common.userInfo.freeCourseRemained > 0 
      && freeTipsShow
      && <div className={styles.freeTips}>
        亲爱的内邀用户，你有{ common.userInfo.freeCourseRemained }个老师课程可以免费学习
        <img src={cross} onClick={this.closeFreeTips.bind(this)}/>
      </div>

    return (
      <div className={styles.normal}>
        {freeChanceDom}
        <div className={styles.header}>
          <img src={`${detail.bannerImg[0]}`} />
          <div className={styles.desc}>
            <div className={styles.title}>{detail.userName}</div> 
            <div className={styles.subTitle}>{detail.company} {detail.userTitle}</div>
          </div>
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
                return <div key={i} className={styles.item} onClick={() => {
                  location.href = `/?courseId=${detail.id}#/lesson/pay/${d.id}`;
                }}>
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
                        d.listenLen && d.listenLen >= d.audioLen ? <span className={styles.over}>已播完</span> : null
                      }
                      { 
                        d.listenLen && d.listenLen < d.audioLen ? <span className={styles.ing}>已播{ parseInt(d.listenLen / d.audioLen * 100) }%</span> : null
                      }
                    </p>
                  </div> 
                  <div className={styles.arrow}></div>
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
  return { course: state.course, common: state.common };
}

export default connect(mapStateToProps)(Course);
