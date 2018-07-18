import React, {Component} from 'react';
import styles from './index.less';

import moment from 'moment';
import ReactHLS from 'react-hls';
import { formatNum, ua } from '../../utils';
import { message } from 'antd';

import defaultPPT from '../../assets/live-banner-default.png';
import liveAnimationSvg from '../../assets/live-play-animation.svg';

class LivePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beginShow: false,
    };
  }

  componentDidMount() {
    // loadScript('//g.alicdn.com/de/prismplayer/2.7.1/aliplayer-min.js', () => {
    //   const options = {
    //     id: 'J_prismPlayer',
    //     width: '100%',
    //     autoplay: false,
    //     isLive: true,
    //     playsinline: true,
    //     source: '//lv.hotelpal.cn/app/stream.m3u8',
    //     useH5Prism: true,
    //     extraInfo: {
    //       liveRetry: 1, 
    //     }
    //   }
    //   new Aliplayer(options, function () {
    //     console.log('播放器创建好了。')
    //   });
    // })
  }

  autoPlay() {
    document.getElementById('myvideo').play();
    this.setState({
      beginShow: true,
    })
  }

  render() {
    const { beginShow } = this.state;
    const { live, now, PPTImg, userInfo, watchingPeopleNum } = this.props;

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
        <div className={styles.tips}>公开课已结束，下次早点来哦~</div>
        <div className={styles.people}><span><img src={liveAnimationSvg} />累计{live.totalPeople}人收看</span></div>
      </div>
    } else if (status === 'ONGOING') {
      function createMarkupVideo() { 
        return { 
          __html: `
            <video 
              webkit-playsinline="true"
              x-webkit-airplay="true"
              preload="auto"
              x5-video-player-type="h5"
              x5-video-player-fullscreen="true"
              x5-playsinline="true"
              playsinline="true"
              src="//lv.hotelpal.cn/app/stream.m3u8"
              id="myvideo"
            >
              <p>你的浏览器不支持 <code>video</code> 标签.</p>
            </video>
          ` 
      }; 
    };

      if (userInfo.enrolled === 'Y' || userInfo.liveVip === 'Y') {
        dom = <div className={styles.player}>
          <div className={styles.ppt}>
            <img src={PPTImg || defaultPPT} />
          </div>
          {/* <ReactHLS url={'//lv.hotelpal.cn/app/stream.m3u8'} /> */}
          <div className={styles.video} key="video" dangerouslySetInnerHTML={createMarkupVideo()}></div>
          { !ua.iOS && !beginShow && <div className={styles.btn} onClick={this.autoPlay.bind(this)}>进入直播</div>  }
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
