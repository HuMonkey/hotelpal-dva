import React, {Component} from 'react';
import styles from './index.less';

class BottomBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.bottomBar}>
        BottomBar
      </div>
    )
  }
}

export default BottomBar;
