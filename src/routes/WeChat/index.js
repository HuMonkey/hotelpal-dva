import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

import chahua from '../../assets/chahua1.png';
import gzh from '../../assets/gongzhonghao.jpg';

function WeChat() {
  return (
    <div className={styles.normal}>
      <img src={chahua} className={styles.chahua1} /> 
      <div className={styles.thing}>
        <img src={gzh} className={styles.erweima} /> 
        <div className={styles.tips}>长按二维码</div> 
        <div className={styles.tips}>关注微信公众号</div>
      </div>
    </div>
  );
}

WeChat.propTypes = {
};

export default connect()(WeChat);
