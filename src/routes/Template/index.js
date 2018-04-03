import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function Course() {
  return (
    <div className={styles.normal}>
      course
    </div>
  );
}

Course.propTypes = {
};

export default connect()(Course);
