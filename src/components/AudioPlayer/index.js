import React, {Component} from 'react';
import ReactPlayer from 'react-player';
import styles from './index.less';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
    this.setState({
      playing: !playing,
    })
  }

  onProgress (eg) {
    this.setState({
      played: eg.played,
      loaded: eg.loaded,
      playedSeconds: eg.playedSeconds, 
    })
  }

  onDuration (duration) {
    this.setState({ duration })
  }

  skip (offset) {
    const { duration, playedSeconds } = this.state;
    this.refs.player.seekTo(playedSeconds + offset);
    this.setState({
      played: (playedSeconds + offset) / duration,
      playedSeconds: playedSeconds + offset,
    })
  }

  onError (ev) {
    console.log('onError', ev);
  }

  onSliderChange (value) {
    this.refs.player.seekTo(value / 100);
    this.setState({
      played: value / 100,
      playedSeconds: this.state.duration * value / 100,
    })
  }

  onEnded () {
    const { goOn } = this.state;
    if (goOn) {
      this.nextLesson();
    }
    this.refs.player.seekTo(0);
    this.setState({
      played: 0,
      playedSeconds: 0,
      playing: false,
    });
  }

  previousLesson () {
    const { isCourse, previous, courseId } = this.props;
    location.href = `/#/lesson/${isCourse ? 'pay' : 'free'}/${previous}${isCourse ? `?courseId=${courseId}` : ''}`;
  }

  nextLesson () {
    const { isCourse, next, courseId } = this.props;
    location.href = `/#/lesson/${isCourse ? 'pay' : 'free'}/${next}${isCourse ? `?courseId=${courseId}` : ''}`;
  }

  render() {
    const { played, loaded, duration, playedSeconds, goOn, playing } = this.state;

    const { audioUrl, previous, next } = this.props;

    let playMinute = Math.floor(playedSeconds / 60);
    playMinute = playMinute < 10 ? '0' + playMinute : playMinute;
    let playSecond = Math.ceil(playedSeconds % 60);
    playSecond = playSecond < 10 ? '0' + playSecond : playSecond;

    let durationMinute = Math.floor((duration - playedSeconds) / 60);
    if (durationMinute < 0) {
      durationMinute = 0;
    }
    durationMinute = durationMinute < 10 ? '0' + durationMinute : durationMinute;
    let durationSecond = Math.ceil((duration - playedSeconds) % 60);
    if (durationSecond < 0) {
      durationSecond = 0;
    }
    durationSecond = durationSecond < 10 ? '0' + durationSecond : durationSecond;

    const playClass = playing ? ' ' + styles.playing : '';
    const clickClass = goOn ? ' ' + styles.clicked : '';

    const previousEmpty = previous == null ? ' ' + styles.empty : '';
    const nextEmpty = next == null ? ' ' + styles.empty : '';

    return (
      <div className={styles.audioPlayer}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.progress}>
              <div className={styles.current}>{playMinute}:{playSecond}</div> 
              <div className={styles.bar}>
                <Slider min={0} max={100} onChange={this.onSliderChange.bind(this)} value={played * 100}/>
              </div> 
              <div className={styles.left}>{durationMinute}:{durationSecond}</div>
            </div> 
            <div className={styles.goOn + clickClass} onClick={this.setGoOn.bind(this)}>连续听</div>
          </div> 
          <div className={styles.bottom}>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.previous15} onClick={() => this.skip.call(this, -15)}>
                <div className={styles.bg}></div>
                15
              </div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.previous + previousEmpty} onClick={this.previousLesson.bind(this)}></div> 
            </div>
            <div className={styles.cell}>
              <div className={styles.playOrPause} ref={`playOrPause`} onClick={this.setPlaying.bind(this)}>
                <div className={styles.inner + playClass}>
                  <div className={styles.borderSolid}></div>
                </div>
              </div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.next + nextEmpty} onClick={this.nextLesson.bind(this)}></div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.next15} onClick={() => this.skip.call(this, 15)}>
                <div className={styles.bg}></div>
                15
              </div>
            </div>
          </div>
        </div>
        <ReactPlayer className={styles.player} key={'player'}
          ref={`player`}
          url={audioUrl}
          playing={playing}
          playsinline={true}
          onProgress={this.onProgress.bind(this)}
          onDuration={this.onDuration.bind(this)}
          onError={this.onError.bind(this)}
          onEnded={this.onEnded.bind(this)}
        />
      </div>
    )
  }
}

export default AudioPlayer;
