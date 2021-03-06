import React, {Component} from 'react';
import { connect } from 'dva';
import { Link, withRouter } from 'dva/router';
import styles from './index.less';

import moment from 'moment';

import bg from '../../assets/profile_bg.png';
import { BottomBar } from '../../components/';
import { dispatchWechatShare } from '../../utils';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      init: false,
    };
  }

  async componentDidMount () {
    const { dispatch } = this.props;
    const protocol = location.protocol;
    const dict = {
      title: '酒店邦成长营',
      link: protocol + '//' + location.hostname,
      imgUrl: protocol + '//static.hotelpal.cn/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    dispatchWechatShare(dict, dispatch);
  }

  async componentDidUpdate () {
    const { common, history, location } = this.props;
    const { init } = this.state;
    if (!init && common.userInfo) {
      this.setState({
        init: true,
      })
      if (!common.userInfo.phone) {
        history.replace({
          pathname: '/login',
          search: `?pathname=${location.pathname}&search=${location.search}`,
        });
      }
    }
  }
  
  render () {
    const { common, profile, coupon } = this.props;
    if (!common.userInfo || !profile || !coupon) {
      return <div></div>
    }
  
    const { userInfo } = common;
    const { statics } = profile;
    const listenedHour = parseInt(statics.listenedTimeInSecond / 60 / 60);
    const listenedMinute = parseInt((statics.listenedTimeInSecond - 60 * 60 * listenedHour) / 60);
  
    let couponNum = 0;
    if (coupon.card) {
      const today = moment();
      const couponList = coupon.couponList && coupon.couponList.filter(d => {
        return d.used === 'N' && today < moment(d.validity);
      });
      const { card, liveVip } = coupon;
      couponNum = couponList.length;
      if (card.exists === 'Y') {
        couponNum += 1;
      }
      if (liveVip.exists === 'Y') {
        couponNum += 1;
      }
    }
    const couponEmptyClass = couponNum === 0 ? ' ' + styles.empty : '';

    return (
      <div className={styles.normal}>
        <BottomBar selected={2}></BottomBar>
        <div className={styles.banner}>
          <img src={bg} />
        </div>
        <div className={styles.header}>
          <Link to={'/modify'}>
            <div className={styles.avater}>
              <div className={styles.img} style={{ backgroundImage: `url(${userInfo.headImg})` }}></div>
            </div> 
            <div className={styles.name}>
              {userInfo.nickname}
              <div className={styles.arrowRight}></div>
            </div> 
          </Link>
          <div className={styles.record}>
            <div className={styles.icon}></div> 
            <span>累计学习</span>
            {listenedHour || 0}小时{listenedMinute || 0}分钟
          </div> 
          <div className={styles.infos}>
            <div className={styles.item}>
              <div className={styles.value}>{statics.signedDays}天</div> 
              <div className={styles.label}>加入成长营</div>
            </div> 
            <div className={styles.item}>
              <div className={styles.value}>{statics.purchasedCourseCount}个</div> 
              <div className={styles.label}>报名课程</div>
            </div> 
            <div className={styles.item}>
              <div className={styles.value}>{statics.listenedLessonCount}节</div> 
              <div className={styles.label}>学习课时</div>
            </div>
          </div>
        </div>
        <div className={styles.rows}>
          <Link to={`/br`}><div className={styles.row + ' ' + styles.bought}>
            <div className={styles.icon + ' ' + styles.shoppingcar}></div>
              购买记录
            <div className={styles.arrowRight}></div>
          </div></Link>
          <div className={styles.hr}><div className={styles.inner}></div></div>
          <Link to={`/coupon`}><div className={styles.row + ' ' + styles.coupon}>
            <div className={styles.icon + ' ' + styles.couponIcon}></div>
              特权与优惠券
            <div className={styles.arrowRight + couponEmptyClass}><span>{couponNum}张可用</span></div>
          </div></Link>
          <div className={styles.hr}><div className={styles.inner}></div></div>
          <Link to={`/invite`}><div className={styles.row + ' ' + styles.invite}>
            <div className={styles.icon + ' ' + styles.inviteIcon}></div>
              邀请好友得￥40
            <div className={styles.arrowRight}></div>
          </div></Link>
          <Link to={`/about`}><div className={styles.row + ' ' + styles.about}>
            <div className={styles.icon + ' ' + styles.jiudianbang}></div>
              关于成长营
            <div className={styles.arrowRight}></div>
          </div></Link>
          <div className={styles.hr}><div className={styles.inner}></div></div>
          <Link to={`/wechat`}><div className={styles.row + ' ' + styles.wechat}>
            <div className={styles.icon + ' ' + styles.gongzhonghao}></div>
              关注公众号
            <div className={styles.arrowRight}></div>
          </div></Link>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
};

const mapStateToProps = (state) => {
  return { common: state.common, profile: state.profile, coupon: state.coupon };
}

export default connect(mapStateToProps)(withRouter(Profile));
