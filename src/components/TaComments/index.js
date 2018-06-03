import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

class TaComments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.TaComments}>
        ta comments
      </div>
    )
  }
}

export default TaComments;
