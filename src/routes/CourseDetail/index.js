import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { CourseContent, Navs } from '../../components';

class CourseDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.getElementsByTagName('html')[0].style.height = 'auto';
    document.getElementsByTagName('body')[0].style.height = 'auto';
  }

  componentWillUnmount() {
    document.getElementsByTagName('html')[0].style.height = '100%';
    document.getElementsByTagName('body')[0].style.height = '100%';
  }

  render () {
    const { course } = this.props;
    if (!course.detail) {
      return <div></div>
    }
    const {detail} = course;

    return (
      <div className={styles.normal}>
        <Navs/>
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
