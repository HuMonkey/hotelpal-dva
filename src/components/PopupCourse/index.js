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
    const { course, closePopup } = this.props;

    function createMarkupSpeaker() { return { __html: course.speaker.desc || '暂无' }; };

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
                    course.tag.split(',').map((d, i) => {
                      return <div className={styles.tag} key={i}>{d}</div>
                    })
                  }
                  <div className={styles.price}>￥{course.price / 100} / {course.lessonNum} 课时</div>
                </div>
              </div>
            </div>
            <div className={styles.main}>
              <div className={styles.desc}>
                <div className={styles.label}>主讲人</div>
                <div className={styles.speaker}>{course.speaker.nick}<span>{course.speaker.company} {course.speaker.title}</span></div>
                <div className={styles.text} dangerouslySetInnerHTML={createMarkupSpeaker()}></div>
              </div>
            </div>
            <div className={styles.buy}>立即订阅：{course.price / 100} / {course.lessonNum} 课时</div>
          </div>
        </div>
      </div>
    )
  }
}

export default PopupCourse;
