import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

class Navs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {selected} = this.props;
    return (
      <div className={styles.navs}>
        <div className={styles.back}></div>
        <div className={styles.home}><Link to={''}>首页</Link></div>
        <div className={styles.gzh}><Link to={'/wechat'}>关注公众号</Link></div>
      </div>
    )
  }
}

export default Navs;
