import React, {Component} from 'react';
import { Link, withRouter } from 'dva/router';
import ReactAudioPlayer from 'react-audio-player';
import styles from './index.less';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { message } from 'antd';

import hongbaoGot from '../../assets/zshb_banner.png';
import banner from '../../assets/jiudianbang-big.png';
import { getParam } from '../../utils';
import Navs from '../Navs';

import moment from 'moment';

const speeds = [1.0, 1.2, 1.5, 2.0];

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      played: 0,
      loaded: 0,
      playedSeconds: 0,
      duration: 0,
      goOn: false,
      playing: false,

      speedIndex: 0,

      init: false,
      loading: true,
    };
  }

  setGoOn () {
    const {goOn} = this.state;
    this.setState({
      goOn: !goOn,
    })
  }

  setPlaying () {
    const {playing} = this.state;
    if (playing) {
      this.refs.player.audioEl.pause();
    } else {
      this.refs.player.audioEl.play();
    }
    this.setState({
      playing: !playing,
    })
  }

  onCanPlay(ev) {
    const { init } = this.state;
    const { audioLen, listenLen, history } = this.props;

    const search = history.location.search;
    const goOn = getParam('goOn', search);
    const playing = getParam('playing', search);
    const speedIndex = getParam('speedIndex', search);
    const courseId = getParam('courseId', search);

    const audioEl = this.refs.player.audioEl;

    const newState = {
      loading: false,
      init: true,
    }
    if (!init) {
      // 设置时长
      newState.duration = audioEl.duration;
      // 设置已听时长
      if (listenLen && audioLen !== listenLen) {
        audioEl.currentTime = listenLen;
        newState.played = listenLen / audioLen;
        newState.playedSeconds = listenLen;
      }
      // 设置连续听
      if (goOn) {
        newState.goOn = goOn;
        newState.playing = playing;
      }
      // 设置听状态
      if (playing) {
        newState.playing = playing;
      }
      // 设置倍数
      if (speedIndex) {
        newState.speedIndex = speedIndex;
        audioEl.playbackRate = speeds[speedIndex];
      }
      if (goOn || playing) {
        audioEl.play();
      }
    }
    this.setState(newState);
  }

  onListen(listenLen) {
    const { playing } = this.state;
    const { audioLen, dispatch, lid } = this.props;
    this.setState({
      played: listenLen / audioLen,
      playedSeconds: Math.round(listenLen), 
    });

    // 每2s发一次
    const now = moment();
    if (now.second() % 2 !== 0) {
      return false;
    }

    const pos = Math.round(listenLen);
    playing && dispatch({
      type: 'lesson/recordListenPos',
      payload: {
        data: {
          lid, pos 
        }
      },
      onResult () {}
    })
  }

  skip (offset) {
    const { duration, playedSeconds } = this.state;
    this.refs.player.audioEl.currentTime = playedSeconds + offset;
    this.setState({
      played: (playedSeconds + offset) / duration,
      playedSeconds: playedSeconds + offset,
      loading: false,
    })
  }

  onError (ev) {
    message.error(ev);
  }

  onSliderChange (value) {
    const { audioLen } = this.props;
    this.refs.player.audioEl.currentTime = audioLen * value / 100;
    this.setState({
      played: value / 100,
      playedSeconds: audioLen * value / 100,
      loading: false,
    })
  }

  onLoadedMetadata() {
    const duration = this.refs.player.audioEl.duration;
    this.setState({
      duration
    })
  }

  onEnded () {
    const { duration, goOn, speedIndex } = this.state;
    const { dispatch, lid } = this.props;
    dispatch({
      type: 'lesson/recordListenPos',
      payload: {
        data: {
          lid, pos: Math.ceil(duration)
        }
      },
      onResult () {}
    })

    if (goOn) {
      this.nextLesson(true);
      return false;
    }
    this.refs.player.audioEl.currentTime = 0;
    this.setState({
      played: 0,
      playedSeconds: 0,
      playing: goOn,
    });
  }

  previousLesson () {
    const { playing, speedIndex } = this.state;
    const { isCourse, previous, courseId, history, dispatch } = this.props;
    if (!previous) {
      return false;
    }
    dispatch({
      type: 'lesson/reset',
      payload: {},
      onResult () {}
    })
    let search = isCourse ? `?courseId=${courseId}` : '?';
    if (speedIndex) {
      search += '&speedIndex=' + speedIndex
    }
    if (playing) {
      search += '&playing=1'
    }
    location.href = `/lesson/${isCourse ? 'pay' : 'free'}/${previous}${search}`;
  }

  nextLesson (goOn) {
    const { playing, speedIndex } = this.state;
    const { isCourse, next, courseId, history, dispatch } = this.props;
    if (!next) {
      return false;
    }
    dispatch({
      type: 'lesson/reset',
      payload: {},
      onResult () {}
    })
    let search = isCourse ? [`courseId=${courseId}`] : [''];
    if (goOn) {
      search.push('goOn=1')
    }
    if (speedIndex) {
      search.push('speedIndex=' + speedIndex)
    }
    if (playing) {
      search.push('playing=1')
    }
    search = `?${search.join('&')}`
    location.href = `/lesson/${isCourse ? 'pay' : 'free'}/${next}${search}`;
  }

  setSpeed () {
    const { speedIndex } = this.state;
    let newSpeedIndex = speedIndex + 1;
    if (newSpeedIndex > 3) {
      newSpeedIndex = 0;
    }
    const audio = this.refs.player.audioEl;
    audio.playbackRate = speeds[newSpeedIndex];
    this.setState({
      speedIndex: newSpeedIndex,
    })
  }

  onReady() {
    message.success('ready');
  }

  componentDidMount() {
    const { nextLesson, dispatch } = this.props;
    if (isNaN(+nextLesson) || !nextLesson) {
      return false;
    }
    dispatch({
      type: 'lesson/fetchNextLessonDetail',
      payload: {
        data: {
          id: +nextLesson,
        }
      },
      onResult(res) {}
    });
  }

  render() {
    const { played, duration, playedSeconds, goOn, playing, speedIndex, loading } = this.state;

    const { nextDetail, audioUrl, previous, next, nextLesson, fromHongbao, free, isCourse, coverImg, scrollDown, historyState = {} } = this.props;

    let playMinute = Math.floor(playedSeconds / 60);
    playMinute = playMinute < 10 ? '0' + playMinute : playMinute;
    let playSecond = Math.ceil(playedSeconds % 60);
    playSecond = playSecond < 10 ? '0' + playSecond : playSecond;

    let durationMinute = Math.floor((duration - playedSeconds) / 60);
    if (durationMinute < 0) {
      durationMinute = 0;
    }
    durationMinute = durationMinute < 10 ? '0' + durationMinute : durationMinute;
    let durationSecond = Math.floor((duration - playedSeconds) % 60);
    if (durationSecond < 0) {
      durationSecond = 0;
    }
    durationSecond = durationSecond < 10 ? '0' + durationSecond : durationSecond;

    const playClass = playing ? ' ' + styles.playing : '';
    const clickClass = goOn ? ' ' + styles.clicked : '';
    const speedClickClass = speedIndex > 0 ? ' ' + styles.clicked : '';

    const previousEmpty = previous == null ? ' ' + styles.empty : '';
    const nextEmpty = next == null ? ' ' + styles.empty : '';

    let leftDuration = Math.floor(duration - playedSeconds);
    if (leftDuration < 0) {
      leftDuration = 0;
    }
    const countDownDom = next && duration && leftDuration < 16 && goOn && playing ? <div className={styles.countDown}>
      <div className={styles.tips}>{ leftDuration }s后将自动为你播放</div>
      <div className={styles.lessonTitle}>{ (nextLesson && nextLesson.title) || (nextDetail && nextDetail.title) }</div>
      <div className={styles.btn} onClick={this.setGoOn.bind(this)}>取消自动播放</div>
    </div> : <div></div>;

    const scrollDownClass = scrollDown ? ' ' + styles.scrollDown : '';
    const loadingClass = loading ? ' ' + styles.loading : '';
    const wwwClass = !fromHongbao && isCourse ? ' ' + styles.www : '';

    return (
      <div className={styles.audioPlayer + scrollDownClass + wwwClass}>
        <Navs/>
        { 
          !isCourse && !scrollDown && <div>
            {/* <Link to="/jdbs"><div className={styles.goback}>
              <img src={banner} />
              <span>成长专栏</span>
              <div className={styles.arrowRight}></div>
            </div></Link> */}
            <div className={styles.banner}>
              <img src={coverImg} />
            </div> 
          </div>
        }
        <div className={styles.wrapper}>
          { fromHongbao && !scrollDown && !free ? <img src={hongbaoGot} className={styles.hongbaoGot} /> : null }
          <div className={styles.top}>
            <div className={styles.progress}>
              <div className={styles.current}>{playMinute}:{playSecond}</div> 
              <div className={styles.bar}>
                <Slider min={0} max={100} onChange={this.onSliderChange.bind(this)} value={played * 100}/>
              </div> 
              <div className={styles.left}>{durationMinute}:{durationSecond}</div>
            </div> 
            <div className={styles.speed + speedClickClass} onClick={this.setSpeed.bind(this)}>倍速{(speeds[speedIndex])}</div>
            <div className={styles.goOn + clickClass} onClick={this.setGoOn.bind(this)}>连续听</div>
          </div> 
          <div className={styles.bottom}>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.previous15} onClick={() => this.skip.call(this, -15)}>
                <div className={styles.bg}></div>
              </div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.previous + previousEmpty} onClick={() => this.previousLesson.call(this)}></div> 
            </div>
            <div className={styles.cell}>
              <div className={styles.playOrPause + loadingClass} ref={`playOrPause`} onClick={this.setPlaying.bind(this)}>
                <div className={styles.inner + playClass}>
                  <div className={styles.borderSolid}></div>
                </div>
              </div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.next + nextEmpty} onClick={() => this.nextLesson.call(this)}></div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.next15} onClick={() => this.skip.call(this, 15)}>
                <div className={styles.bg}></div>
              </div>
            </div>
          </div>
          { countDownDom }
        </div>
        <ReactAudioPlayer
          src={audioUrl}
          ref={'player'}
          listenInterval={1000}
          autoPlay={historyState.playing || historyState.goOn}
          preload={'auto'}
          onListen={this.onListen.bind(this)}
          onCanPlay={this.onCanPlay.bind(this)}
          onCanPlayThrough={this.onCanPlay.bind(this)}
          onError={this.onError.bind(this)}
          onEnded={this.onEnded.bind(this)}
          onLoadedMetadata={this.onLoadedMetadata.bind(this)}
        />
      </div>
    )
  }
}

export default withRouter(AudioPlayer);
