import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function Profile() {
  return (
    <div className={styles.normal}>
      Profile
    </div>
  );
}

Profile.propTypes = {
};

export default connect()(Profile);
