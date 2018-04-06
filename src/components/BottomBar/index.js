import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

class BottomBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {selected} = this.props;
    return (
      <div className={styles.bottomBar}>
        <div className={styles.footer}>
          <div className={styles.item + ' ' + (selected === 0 && styles.selected)}>
            <Link to={`/`}> <div className={styles.img}></div>
            发现</Link>
          </div>
          <div className={styles.item + ' ' + (selected === 1 && styles.selected)}>
            <Link to={`/bought`}><div className={styles.img}></div>
            已购课程</Link>
          </div>
          <div className={styles.item + ' ' + (selected === 2 && styles.selected)}>
            <Link to={`/profile`}><div className={styles.img}></div>
            我的</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default BottomBar;
