import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function Live() {
  return (
    <div className={styles.normal}>
      <div className={styles.banner}>
        <div className={styles.count}>
          <div className={styles.icon}></div>
          <div className={styles.label}>倒计时</div>
          <div className={styles.tick}>
            <span className={styles.item}>00</span>
            :
            <span className={styles.item}>02</span>
            :
            <span className={styles.item}>26</span>
            :
            <span className={styles.item}>24</span>
          </div>
        </div>
      </div>
      <div className={styles.switches}>
        <div className={styles.item + ' ' + styles.active}>课程</div>
        <div className={styles.item}>互动</div>
      </div>
      <div className={styles.course}>
        <div className={styles.left}>
          <div className={styles.tag + ' ' + styles.before}>
            直播中
            <div className={styles.tri}></div>
          </div>
          <div className={styles.time}>03-19&nbsp;周四&nbsp;20:00</div>
        </div>
        <div className={styles.right}>已有200000人报名</div>
      </div>
      <div className={styles.signups}>
        <div className={styles.item}>
          <div className={styles.left}>
            <div className={styles.inner}>直播价&nbsp;￥49</div>
          </div>
          <div className={styles.right}>我要付费报名</div>
        </div>
        <div className={styles.item}>
          <div className={styles.left}>
            <div className={styles.inner}>邀请5个好友可以免费</div>
          </div>
          <div className={styles.right}>我要免费报名</div>
        </div>
      </div>
      <div className={styles.intro}>
        <div className={styles.title}>公开课介绍</div>
        <div className={styles.content}>介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍</div>
      </div>
      <div className={styles.know}>
        <div className={styles.title}>公开课须知</div>
        <div className={styles.content}>介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍</div>
      </div>
      <div className={styles.poster}>
        <div className={styles.main}></div>
        <div className={styles.close}></div>
      </div>
    </div>
  );
}

Live.propTypes = {
};

export default connect()(Live);
