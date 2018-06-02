import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import ErweimaModal from '../ErweimaModal';

class Navs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erweima: false,
    };
  }

  render() {
    const { erweima } = this.state;
    return (
      <div className={styles.navs}>
        <div className={styles.back}></div>
        <div className={styles.home}><Link to={''}>首页</Link></div>
        <div className={styles.gzh} onClick={() => {
          this.setState({
            erweima: true,
          })
        }}>关注公众号</div>
        { erweima && <ErweimaModal onClose={() => {
          this.setState({
            erweima: false,
          })
        }} /> }
      </div>
    )
  }
}

export default Navs;
