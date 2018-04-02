import React, {Component} from 'react';
import styles from './index.less';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.audioPlayer}>
        audio player
      </div>
    )
  }
}

export default AudioPlayer;
