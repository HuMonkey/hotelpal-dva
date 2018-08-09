import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import { Icon, Input } from 'antd';

class PopupCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { course, userInfo = {}, closePopup, onSubmit } = this.props;

    const { courseContent } = course;

    function createMarkupSpeaker() { return { __html: course.speaker.desc || '暂无' }; };
    function createMarkupIntroduce() { return { __html: courseContent.introduce || '暂无' }; };
    function createMarkupCrowd() { return { __html: courseContent.crowd || '暂无' }; };
    function createMarkupGain() { return { __html: courseContent.gain || '暂无' }; };
    function createMarkupSubscribe() { return { __html: courseContent.subscribe || '暂无' }; };

    return (
      <div className={styles.popupCourse}>
        <div className={styles.content}>
          <Icon type="close" size={`large`} className={styles.close} onClick={closePopup} />
          <div>
            <div className={styles.top}>
              <div className={styles.avatar} style={{ backgroundImage: `url(${course.bannerImg})` }}></div>
              <div className={styles.right}>
                <div className={styles.title}>{course.title}</div>
                <div className={styles.infos}>
                  {
                    course.tag && course.tag.split(',').map((d, i) => {
                      return <div className={styles.tag} key={i}>{d}</div>
                    })
                  }
                  <div className={styles.price}>￥{course.price / 100} / {course.lessonNum} 课时</div>
                </div>
              </div>
            </div>
            <div className={styles.main}>
              {course.speaker && <div className={styles.desc}>
                <div className={styles.label}>主讲人</div>
                <div className={styles.speaker}>{course.speaker.nick}<span>{course.speaker.company} {course.speaker.title}</span></div>
                <div className={styles.text} dangerouslySetInnerHTML={createMarkupSpeaker()}></div>
              </div>}
              <div className={styles.desc}>
                <div className={styles.label}>课程介绍</div>
                <div className={styles.text} dangerouslySetInnerHTML={createMarkupIntroduce()}></div>
              </div>
              <div className={styles.desc}>
                <div className={styles.label}>适宜人群</div>
                <div className={styles.text} dangerouslySetInnerHTML={createMarkupCrowd()}></div>
              </div>
              <div className={styles.desc}>
                <div className={styles.label}>您将收获</div>
                <div className={styles.text} dangerouslySetInnerHTML={createMarkupGain()}></div>
              </div>
              <div className={styles.desc}>
                <div className={styles.label}>订阅须知</div>
                <div className={styles.text} dangerouslySetInnerHTML={createMarkupSubscribe()}></div>
              </div>
            </div>
            { userInfo.relateCoursePurchased !== 'Y' && <div className={styles.buy} onClick={onSubmit}>立即订阅：{course.price / 100} / {course.lessonNum} 课时</div> }
            { userInfo.relateCoursePurchased === 'Y' && <div className={styles.buy + ' ' + styles.already}>已购买</div> }
          </div>
        </div>
      </div>
    )
  }
}

export default PopupCourse;
