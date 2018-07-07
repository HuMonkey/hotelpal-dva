import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { setCookie } from '../../utils';

class Clear extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    setCookie('jdbtk', '', '1s');
  }

  render () {
    return (
      <div className={styles.normal}>
        正在清除COOKIE，请稍等
      </div>
    );
  }
}

Clear.propTypes = {
};

export default connect()(Clear);
