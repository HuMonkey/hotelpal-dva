import React, {Component} from 'react';
import styles from './index.less';

class Wave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  render() {
    return (
      <div className={styles.wave}>
        <div className={styles.ocean}>
          <div className={styles.inner2}></div>
          <div className={styles.inner}></div>
        </div>
      </div>
    )
  }
}

export default Wave;
