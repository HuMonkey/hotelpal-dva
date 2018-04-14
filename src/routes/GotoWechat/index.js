import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function GotoWechat() {
  return (
    <div className={styles.normal}>
      请到微信上酒店邦成长营
    </div>
  );
}

GotoWechat.propTypes = {
};

export default connect()(GotoWechat);
