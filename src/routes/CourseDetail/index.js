import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { CourseContent } from '../../components';

class CourseDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { course } = this.props;
    if (!course.detail) {
      return <div></div>
    }
    const {detail} = course;

    return (
      <div className={styles.normal}>
        <CourseContent course={detail} isDetail={true}></CourseContent>
      </div>
    );
  }
}

CourseDetail.propTypes = {
};

const mapStateToProps = (state) => {
  return { course: state.course };
}

export default connect(mapStateToProps)(CourseDetail);
