import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function Bought() {
  return (
    <div className={styles.normal}>
      Bought
    </div>
  );
}

Bought.propTypes = {
};

export default connect()(Bought);
