import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

import jdb from '../../assets/jiudianbang-big.png';

function Course() {
  return (
    <div className={styles.normal}>
      <div className={styles.header}>
        <img src={`http://img.hotelpal.cn/1509955068424.jpg`} />
        <div className={styles.desc}>
          <div className={styles.title}>葛健</div> 
          <div className={styles.subTitle}>酒店哥 CEO</div>
        </div>
      </div>
      <div className={styles.gotoDetail}>
        <div className={styles.title}>酒店电商万能公式从0到1</div> 
        <div className={styles.subTitle}>解决所有电商问题</div> 
        <div className={styles.arrow}></div>
      </div>
      <div className={styles.lessons}>
        <div className={styles.title}>课时内容</div>
        <div className={styles.list}>
          {
            [1, 1, 1, 1].map((d, i) => {
              return <div key={i} className={styles.item}>
                <div className={styles.up}>
                  <span className={styles.ltitle}>01&nbsp;|&nbsp;什么是酒店电商万能公式？</span> 
                  <span className={styles.tag}>免费试听</span>
                </div> 
                <div className={styles.down}>
                  <p>
                    <span>2017-10-02</span> 
                    <span>6.0 MB</span> 
                    <span>14:35</span> 
                    <span className={styles.over}>已播完</span>
                  </p>
                </div> 
                <div className={styles.arrow}></div>
              </div>
            })
          }
        </div>
        <div className={styles.hr}></div>
      </div>
      <div className={styles.back}>
        <div className={styles.box}>
          <img src={jdb} /> 
          <div className={styles.title}>酒店邦成长营</div> 
          <div className={styles.desc}>为你提供高效、省时的知识服务</div> 
          <div className={styles.arrow}></div>
        </div>
      </div>
    </div>
  );
}

Course.propTypes = {
};

export default connect()(Course);
