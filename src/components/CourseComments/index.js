import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

class CourseComments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { erweima } = this.state;
    return (
      <div className={styles.courseComments}>
        course comments
      </div>
    )
  }
}

export default CourseComments;
