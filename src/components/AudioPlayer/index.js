import React, {Component} from 'react';
import ReactPlayer from 'react-player';
import styles from './index.less';

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

  onError () {
    console.log('onError');
  }

  render() {
    const { played, loaded, duration, playedSeconds, goOn, playing } = this.state;

    let playMinute = Math.floor(playedSeconds / 60);
    playMinute = playMinute < 10 ? '0' + playMinute : playMinute;
    let playSecond = Math.ceil(playedSeconds % 60);
    playSecond = playSecond < 10 ? '0' + playSecond : playSecond;

    let durationMinute = Math.floor((duration - playedSeconds) / 60);
    durationMinute = durationMinute < 10 ? '0' + durationMinute : durationMinute;
    let durationSecond = Math.ceil((duration - playedSeconds) % 60);
    durationSecond = durationSecond < 10 ? '0' + durationSecond : durationSecond;

    const playClass = playing ? ' ' + styles.playing : '';
    const clickClass = goOn ? ' ' + styles.clicked : '';

    return (
      <div className={styles.audioPlayer}>
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.progress}>
              <div className={styles.current}>{playMinute}:{playSecond}</div> 
              <div className={styles.bar}>
                <div className={styles.duration}>
                  <div className={styles.inner} style={ { width: `${played * 100}%` } }></div>
                  <div className={styles.loaded} style={ { width: `${loaded * 100}%` } }></div>
                </div> 
                <div className={styles.dot} style={ { left: `${played * 100}%` } }>
                  <div className={styles.dotInner}></div>
                </div>
              </div> 
              <div className={styles.left}>{durationMinute}:{durationSecond}</div>
            </div> 
            <div className={styles.goOn + clickClass} onClick={this.setGoOn.bind(this)}>连续听</div>
          </div> 
          <div className={styles.bottom}>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.previous15}>
                <div className={styles.bg}></div>
                15
              </div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.previous + ' ' + styles.empty}></div> 
            </div>
            <div className={styles.cell}>
              <div className={styles.playOrPause} ref={`playOrPause`} onClick={this.setPlaying.bind(this)}>
                <div className={styles.inner + playClass}>
                  <div className={styles.borderSolid}></div>
                </div>
              </div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.next}></div> 
            </div>
            <div className={styles.cell + ' ' + styles.small}>
              <div className={styles.next15}>
                <div className={styles.bg}></div>
                15
              </div>
            </div>
          </div>
        </div>
        <ReactPlayer key={'player'}
          url='//storage.googleapis.com/media-session/elephants-dream/the-wires.mp3' 
          playing={playing}
          onProgress={this.onProgress.bind(this)}
          onDuration={this.onDuration.bind(this)}
          onError={this.onError.bind(this)}
        />
      </div>
    )
  }
}

export default AudioPlayer;
