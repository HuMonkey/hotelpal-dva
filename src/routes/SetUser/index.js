import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { setCookie } from '../../utils';

class SetUser extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    setCookie('jdbtk', 'oyH7Q0SYJCbDFHYs8QkhTZ90P2qk', '12d');
  }

  render () {
    return (
      <div className={styles.normal}>
        设置成功！
      </div>
    );
  }
}

SetUser.propTypes = {
};

export default connect()(SetUser);
