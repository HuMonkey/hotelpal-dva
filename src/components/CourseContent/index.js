import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

class CourseContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overflow: true,
    };
  }

  open () {
    this.setState({
      overflow: false,
    })
  }

  close () {
    this.setState({
      overflow: true,
    })
  }

  render() {
    const { overflow } = this.state;
    const { course, isDetail } = this.props;

    function createMarkupTeacher() { return { __html: course.speakerDescribe || '暂无' }; };
    function createMarkupIntroduce() { return { __html: course.introduce || '暂无' }; };
    function createMarkupCrowd() { return { __html: course.crowd || '暂无' }; };
    function createMarkupGain() { return { __html: course.gain || '暂无' }; };
    function createMarkupSubscribe() { return { __html: course.subscribe || '暂无' }; };
  
    const overflowClass = !isDetail && overflow ? ' ' + styles.overflow : '';

    const teacherDom = isDetail ? <div className={styles.teacher}>
      <div className={styles.avatar}>
        <img src={course.headImg} />
      </div>
      <div className={styles.desc}>
        <div className={styles.slabel}>主讲人</div>
        <div className={styles.user}>
          <span className={styles.userName}>{ course.userName }</span>
          <span className={styles.userTitle}>{ course.company + ' ' + course.userTitle }</span>
        </div>
      </div>
    </div> : <div className={styles.block}>
      <div className={styles.label}>主讲人</div>
      <div className={styles.name}>
        <span className={styles.userName}>{ course.userName }</span>
        <span className={styles.userTitle}>{ course.company}<span className={styles.point}>·</span>{course.userTitle }</span>
      </div>
      <div className={styles.intro} dangerouslySetInnerHTML={createMarkupTeacher()}></div>
      <div className={styles.hr}></div>
    </div>

    return (
      <div className={styles.courseContent}>
        { teacherDom }
        <div className={styles.block + ' ' + styles.courseIntro}>
          <div className={styles.label}>课程介绍</div>
          <div className={styles.intro + overflowClass} dangerouslySetInnerHTML={createMarkupIntroduce()}></div>
          {!isDetail && overflow && <div className={styles.open} onClick={this.open.bind(this)}>{'查看完整介绍'}</div>}
          {!isDetail && !overflow && <div className={styles.open} onClick={this.close.bind(this)}>{'收起完整介绍'}</div>}
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
    )
  }
}

export default CourseContent;
