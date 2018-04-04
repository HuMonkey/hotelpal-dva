import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function CourseDetail() {
  return (
    <div className={styles.normal}>
      CourseDetail
    </div>
  );
}

CourseDetail.propTypes = {
};

export default connect()(CourseDetail);
