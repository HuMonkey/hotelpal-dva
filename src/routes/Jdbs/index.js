import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function Jdbs() {
  return (
    <div className={styles.normal}>
      jdbs
    </div>
  );
}

Jdbs.propTypes = {
};

export default connect()(Jdbs);
