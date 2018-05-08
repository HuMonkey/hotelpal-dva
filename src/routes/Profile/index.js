import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import bg from '../../assets/profile_bg.png';
import { BottomBar } from '../../components/';
import { configWechat, updateWechartShare } from '../../utils';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  async componentDidMount () {
    const { dispatch } = this.props;

    const dict = {
      title: '酒店邦成长营',
      link: location.href,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }

    await dispatch({
      type: 'common/getWechatSign',
      payload: {
        data: {
          url: location.href.split('#')[0]
        }
      },
      onResult (res) {
        if (res.data.code === 0) {
          const {appid, noncestr, sign, timestamp, url} = res.data.data;
          configWechat(appid, timestamp, noncestr, sign, () => {
            updateWechartShare(dict);
          });
        }
      }
    });
  }
  
  render () {
    const { common, profile } = this.props;
    if (!common.userInfo || !profile) {
      return <div></div>
    }
  
    const { userInfo } = common;
    const { statics } = profile;
    const listenedHour = parseInt(statics.listenedTimeInSecond / 60 / 60);
    const listenedMinute = parseInt((statics.listenedTimeInSecond - 60 * 60 * listenedHour) / 60);
  
    return (
      <div className={styles.normal}>
        <BottomBar selected={2}></BottomBar>
        <div className={styles.banner}>
          <img src={bg} />
        </div>
        <div className={styles.header}>
          <div className={styles.avater}>
            <div className={styles.img + ' ' + styles.short}>
              <img src={userInfo.headImg} />
            </div>
          </div> 
          <Link to={'/modify'}><div className={styles.name}>
            {userInfo.nickname}
            <div className={styles.arrowRight}></div>
          </div> </Link>
          <div className={styles.record}>
            <div className={styles.icon}></div> 
            <span>累计学习</span>
            {listenedHour}小时{listenedMinute}分钟
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
          <Link to={`/br`}><div className={styles.row + ' ' + styles.coupon}>
            <div className={styles.icon + ' ' + styles.couponIcon}></div>
              特权与优惠券
            <div className={styles.arrowRight}><span>2张可用</span></div>
          </div></Link>
          <Link to={`/br`}><div className={styles.row + ' ' + styles.invite}>
            <div className={styles.icon + ' ' + styles.inviteIcon}></div>
              邀请好友得￥20
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
  return { common: state.common, profile: state.profile };
}

export default connect(mapStateToProps)(Profile);
