import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import jdb from '../../assets/jiudianbang-big.png';

class BackBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.back}>
        <Link to={'/'}>
          <div className={styles.box}>
            <img src={jdb} /> 
            <div className={styles.title}>酒店邦成长营</div> 
            <div className={styles.desc}>为你提供高效、省时的知识服务</div> 
            <div className={styles.arrow}></div>
          </div>
        </Link>
      </div>
    )
  }
}

export default BackBtn;
