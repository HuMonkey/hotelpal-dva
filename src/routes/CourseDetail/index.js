import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

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

    function createMarkupTeacher() { return { __html: detail.speakerDescribe || '暂无' }; };
    function createMarkupIntroduce() { return { __html: detail.introduce || '暂无' }; };
    function createMarkupCrowd() { return { __html: detail.crowd || '暂无' }; };
    function createMarkupGain() { return { __html: detail.gain || '暂无' }; };
    function createMarkupSubscribe() { return { __html: detail.subscribe || '暂无' }; };

    return (
      <div className={styles.normal}>
        <div className={styles.teacher}>
          <div className={styles.avatar}>
            <img src={detail.headImg} />
          </div>
          <div className={styles.desc}>
            <div className={styles.label}>主讲人</div>
            <div className={styles.user}>
              <span className={styles.userName}>{ detail.userName }</span>
              <span className={styles.userTitle}>{ detail.company + ' ' + detail.userTitle }</span>
            </div>
          </div>
        </div>
        <div className={styles.intro} dangerouslySetInnerHTML={createMarkupTeacher()}></div>
        <div className={styles.hr}></div>
        <div className={styles.block + ' ' + styles.courseIntro}>
          <div className={styles.label}>课程介绍</div>
          <div className={styles.intro} dangerouslySetInnerHTML={createMarkupIntroduce()}></div>
          <div className={styles.hr}></div>
        </div>
        <div className={styles.block + ' ' + styles.who}>
          <div className={styles.label}>适宜人群</div>
          <div className={styles.intro} dangerouslySetInnerHTML={createMarkupCrowd()}></div>
          <div className={styles.hr}></div>
        </div>
        <div className={styles.block + ' ' + styles.getting}>
          <div className={styles.label}>你将收获</div>
          <div className={styles.intro} dangerouslySetInnerHTML={createMarkupGain()}></div>
          <div className={styles.hr}></div>
        </div>
        <div className={styles.block + ' ' + styles.care}>
          <div className={styles.label}>订阅须知</div>
          <div className={styles.intro} dangerouslySetInnerHTML={createMarkupSubscribe()}></div>
          <div className={styles.hr}></div>
        </div>
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
