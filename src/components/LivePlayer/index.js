import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import moment from 'moment';
import { formatNum } from '../../utils';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'videojs-contrib-hls';

import defaultPPT from '../../assets/live-banner-default.png';

class LivePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // videojs('my-video');
  }

  render() {
    const { live, now, countDownInter, PPTImg, userInfo, watchingPeopleNum } = this.props;

    const openTime = moment(live.openTime);
    const diffTime = openTime - now;
    const duration = moment.duration(diffTime, 'milliseconds');
    if (diffTime <= 0) {
      clearInterval(countDownInter);
    }

    let status = live.status;

    let dom;
    if (status === 'ENROLLING') {
      // 如果报名中，显示海报
      dom = <div className={styles.player}>
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
        <div className={styles.cover} style={{ backgroundImage: `url(${live.bannerImg || defaultPPT})` }}></div>
      </div>
    } else if (status === 'ENDED') {
      dom = <div className={styles.player + ' ' + styles.bg}>
        <div className={styles.split}></div>
        <div className={styles.tips}>公开课已结束，下次早点来哦~</div>
        <div className={styles.people}><span>累计{live.totalPeople}人收看</span></div>
      </div>
    } else if (status === 'ONGOING') {
      if (userInfo.enrolled === 'Y' || userInfo.liveVip === 'Y') {
        dom = <div className={styles.player}>
          <div className={styles.ppt}>
            <img src={PPTImg || defaultPPT} />
          </div>
          <video 
            ref={`player`} 
            id="my-video" 
            className="video-js vjs-default-skin" 
            controls 
            width="100%" 
            height="100%"
            preload="load" 
            playsInline="true"
            autoPlay="autoplay"
          >
            <source src="//lv.hotelpal.cn/app/stream.m3u8" type='application/x-mpegURL' />
          </video>
          <div className={styles.people}><span>{watchingPeopleNum}人正在收看</span></div>
        </div>
      } else {
        dom = <div className={styles.player + ' ' + styles.bg}>
          <div className={styles.split}></div>
          <div className={styles.tips}>需要报名才能观看公开课</div>
          <div className={styles.people}><span>{watchingPeopleNum}人正在收看</span></div>
        </div>
      }
    }
    return (
      <div className={styles.livePlayer}>
        { dom }
      </div>
    )
  }
}

export default LivePlayer;
