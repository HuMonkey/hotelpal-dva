import React, {Component} from 'react';
import { connect } from 'dva';
import { Link, withRouter } from 'dva/router';
import { Icon, Input, message } from 'antd';
import styles from './index.less';
import moment from 'moment';

import moneyIcon from '../../assets/invite-money.svg';
import couponEmpty from '../../assets/coupon-empty.png';
import { BackBtn, Navs } from '../../components';
import { getParam } from '../../utils';

class SysCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      result: null, // 领取成功 got 来晚了 late 领取过 already
    };
  }

  // 领取优惠券
  getSysCoupon() {
    const { dispatch, location } = this.props;
    const nonce = getParam('nonce', location.search);
    const sysCouponId = getParam('sysCouponId', location.search);

    dispatch({
      type: 'common/getSysCoupon',
      payload: {
        data: {
          nonce, sysCouponId,
        }
      },
      onResult: (res) => {
        if (res.data.code === 0) {
          this.setState({
            result: 'got',
          })
        } else if (res.data.code === 326) {
          this.setState({
            result: 'already',
          })
        } else if (res.data.code === 329) {
          this.setState({
            result: 'late',
          })
        } else {
          message.error('获取优惠券出了点问题，请联系强哥~');
        }
      }
    });
  }

  async getSysCouponInfo() {
    const { dispatch, location } = this.props;
    const sysCouponId = getParam('sysCouponId', location.search);
    await dispatch({
      type: 'common/getSysCouponInfo',
      payload: {
        data: {
          sysCouponId
        }
      },
      onResult() {}
    })
    this.getSysCoupon();
  }

  componentDidUpdate () {
    const { init } = this.state;
    const { common, history, location } = this.props;
    if (!init && common.userInfo) {
      this.setState({
        init: true,
      });
      if (!common.userInfo.phone) {
        message.error('请先注册再领取优惠券哦~')
        history.replace({
          pathname: '/login',
          search: `?pathname=${encodeURIComponent(location.pathname)}&search=${encodeURIComponent(location.search)}`
        })
      }
      this.getSysCouponInfo();
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'course/getRecommendCourse',
    //   payload: {},
    //   onResult(data) {}
    // })
  }

  gotoCourse(id) {
    location.href = `/course/${id}`;
  }

  render() {
    const { result } = this.state;
    const { common, recommendCourse } = this.props;

    const couponInfo = common.couponInfo || {};

    const applyToCoursePO = couponInfo.applyToCoursePO;

    let rp;
    let recommendDom = null;
    if (couponInfo) {
      let tips;
      if (couponInfo.apply === 'PARTICULAR') {
        tips = '部分订阅专栏可用';
        recommendDom = applyToCoursePO && applyToCoursePO.map((d, i) => {
          const className = !d.purchased ? '' : ' ' + styles.gotit;
          return <div key={i} className={styles.course} onClick={() => {
            this.gotoCourse.call(this, d.id);
          }}>
            <div className={styles.box + className}>
              <div className={styles.arrow}></div>
              <div className={styles.avatar} style={{ backgroundImage: `url(${d.bannerImg})` }}></div>
              <div className={styles.desc}>
                <div className={styles.title}>{d.title}·{d.speaker.nick}</div>
                {
                  !d.purchased && <div className={styles.tips}>
                    <span className={styles.after}>券后仅需{d.price / 100 - couponInfo.value / 100}元&nbsp;</span>
                    <span className={styles.before}>原价￥{d.price / 100}</span>
                  </div>
                }
                {
                  d.purchased && <div className={styles.tips}>
                    <span className={styles.got}>你已购买这个课程</span>
                  </div>
                }
              </div>
            </div>
          </div>
        })
      } else if (couponInfo.apply === 'ALL') {
        tips = '所有订阅专栏可用';
        if (!recommendCourse) {
          recommendDom = null;
        } else {
          const course = recommendCourse.vo;
          recommendDom = <div className={styles.course} onClick={() => {
            this.gotoCourse.call(this, course.id);
          }}>
            <div className={styles.box}>
              <div className={styles.arrow}></div>
              <div className={styles.avatar} style={{ backgroundImage: `url(${course.bannerImg})` }}></div>
              <div className={styles.desc}>
                <div className={styles.title}>{course.title}·{course.speaker.nick}</div>
                  <div className={styles.tips}>
                    <span className={styles.after}>券后仅需{course.price / 100 - couponInfo.value / 100}元&nbsp;</span>
                    <span className={styles.before}>原价￥{course.price / 100}</span>
                  </div>
              </div>
            </div>
          </div>;
        }
      }
      rp = <div className={styles.rp}>
        <div className={styles.stitle}>{couponInfo.name}</div>
        <div className={styles.price}><span>{couponInfo.value / 100}</span>元</div>
        <div className={styles.tips}>{tips}</div>
      </div>;
    }

    let validity;
    if (couponInfo.validityType === 'FIXED_DAYS') {
      validity = (moment().add(+couponInfo.validityDays, 'days')).format('YYYY-MM-DD');
    } else {
      validity = moment(couponInfo.validity).format('YYYY-MM-DD');
    }
    const validityDom = <div className={styles.label0}>有效期至 {validity}</div>;

    // 页面初始化
    const initDom = <div className={styles.resultPage}>
      { rp }
      <div className={styles.getBtn} onClick={this.getSysCoupon.bind(this)}>点击领取</div>
    </div>;

    const ucan = <div>
      <div className={styles.label}>
        { result !== 'late' && couponInfo.apply === 'PARTICULAR' && '以下课程可用' }
        { result !== 'late' && couponInfo.apply === 'ALL' && '所有订阅专栏可用' + ( recommendCourse ? '，为你推荐' : '' ) }
        { 
          result === 'late' && '你可以'
        }
      </div>
      {
        result === 'late' && <Link to='/invite'><div className={styles.sbtn}>
          推荐好友得40元
          <img src={moneyIcon} className={styles.money} />
          <Icon className={styles.icon} type="right" />
        </div></Link>
      }
      {
        result !== 'late' && recommendDom
      }
      <BackBtn />
    </div>

    // 领取成功
    const gotDom = <div className={styles.resultPage}>
      <div>
        <div className={styles.text}>恭喜您！</div>
        <div className={styles.text}>获得一张优惠券</div>
      </div>
      { rp }
      { validityDom }
      <div className={styles.label1}>优惠券已经放入您的账号{common.userInfo && common.userInfo.phone}</div>
      { ucan }
    </div>;

    // 优惠券领完了
    const lateDom = <div className={styles.resultPage}>
      <div>
        <div className={styles.text}>来晚了</div>
        <div className={styles.text}>优惠券已领完</div>
      </div>
      <img className={styles.latePng} src={couponEmpty} />
      { ucan }
    </div>;

    // 优惠券领过了
    const alreadyDom = <div className={styles.resultPage}>
      <div><div className={styles.text}>您已获取过该优惠券</div></div>
      { rp }
      { validityDom }
      <div className={styles.label1}>优惠券已经放入您的账号{common.userInfo && common.userInfo.phone}</div>
      { ucan }
    </div>;

    return <div className={styles.normal}>
      <Navs/>
      <div className={styles.main}>
        {/* { !result && initDom } */}
        { result === 'got' && gotDom }
        { result === 'late' && lateDom }
        { result === 'already' && alreadyDom }
      </div>
    </div>

  }
}

SysCoupon.propTypes = {
};

const mapStateToProps = (state) => {
  return { 
    invite: state.invite, 
    recommendCourse: state.course.recommendCourse, 
    common: state.common 
  };
}

export default connect(mapStateToProps)(withRouter(SysCoupon));
