import React, {Component, PureComponent} from 'react';
import styles from './index.less';

import moment from 'moment';
import ReactHLS from 'react-hls';
import { formatNum, ua, liveMemberCardUseful, loadScript } from '../../utils';
import { message } from 'antd';

import defaultPPT from '../../assets/live-banner-default.png';
import liveAnimationSvg from '../../assets/live-play-animation.svg';

class H5Video extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { url } = this.props;
    function createMarkupVideo() { 
      return {
        __html: !ua.android ? `<video 
            preload="auto" 
            autoplay
            webkit-playsinline="true" 
            playsinline="true" 
            src="//${url}.m3u8"
            id="myvideo"
          >
            <p>你的浏览器不支持 <code>video</code> 标签.</p>
          </video>` : `<video 
            preload="auto" 
            autoplay
            x5-playsinline
            src="//${url}.m3u8"
            id="myvideo"
          >
            <p>你的浏览器不支持 <code>video</code> 标签.</p>
          </video>
        ` 
      }; 
    };
    // return <div id="myvideo"></div>
    return <div className={styles.video} key="video" dangerouslySetInnerHTML={createMarkupVideo()}></div>
  }
}

class LivePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beginShow: false,
    };
  }

  componentDidMount() {}

  autoPlay() {
    // document.querySelector('#myvideo video').play();
    document.querySelector('#myvideo').play();
    this.setState({
      beginShow: true,
    })
  }

  render() {
    const { beginShow } = this.state;
    const { live, now, PPTImg, userInfo, watchingPeopleNum, coupon } = this.props;

    const openTime = moment(live.openTime);
    const diffTime = openTime - now;
    const duration = moment.duration(diffTime, 'milliseconds');

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
        <div className={styles.tips}>直播课已结束，下次早点来哦~</div>
        <div className={styles.people}><span><img src={liveAnimationSvg} />累计{live.totalPeople}人收看</span></div>
      </div>
    } else if (status === 'ONGOING') {
      if (userInfo.enrolled === 'Y' || (userInfo.liveVip === 'Y' && liveMemberCardUseful(coupon.liveVip))) {
        dom = <div className={styles.player}>
          <div className={styles.ppt}>
            <img src={PPTImg || defaultPPT} />
          </div>
          <H5Video url={live.liveAudio}/>
          { 
            ua.android && !beginShow && <div className={styles.btn} onClick={this.autoPlay.bind(this)}>
              <div className={styles.playBtn}></div>
              点击进入直播
            </div>  
          }
          <div className={styles.people}><span><img src={liveAnimationSvg} />{watchingPeopleNum}人正在收看</span></div>
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
