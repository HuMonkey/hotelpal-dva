import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

class GotoWechat extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className={styles.normal}>
        请到微信上酒店邦成长营
      </div>
    );
  }
}

GotoWechat.propTypes = {
};

export default connect()(GotoWechat);
