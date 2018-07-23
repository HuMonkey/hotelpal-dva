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
    // setCookie('jdbtk', 'oyH7Q0ZFriOhsgO3DWrXXcf-cZq8', '12d');
    // setCookie('jdbtk', 'oyH7Q0ZhHS3gthW8eOKFyVc1-zeo', '12d');
    // setCookie('jdbtk', 'oyH7Q0fvWJo8cdskYjxcGtlStjFs', '12d');
    setCookie('jdbtk', 'oyH7Q0c0d92cblJsJ0n8LyBtwets', '12d');
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
