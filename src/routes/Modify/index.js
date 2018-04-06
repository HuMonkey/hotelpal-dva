import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function Modify() {
  return (
    <div className={styles.normal}>
      <div className={styles.avater}>
        <div className={styles.img + ' ' + styles.short}>
          <img src="http://img.hotelpal.cn/1505554345809.JPG" />
        </div>
      </div> 
      <input type="file" className={styles.avaterUpload} /> 
      <div className={styles.wechatName}></div> 
      <div className={styles.row + ' ' + styles.name}>
        <div className={styles.label}>姓名</div> 
        <div className={styles.vr}></div> 
        <input type="text" name="name" placeholder="请输入您的姓名" />
      </div> 
      <div className={styles.row + ' ' + styles.company}>
        <div className={styles.label}>公司</div> 
        <div className={styles.vr}></div> 
        <input type="text" name="company" placeholder="请输入您的公司（选填）" />
      </div> 
      <div className={styles.row + ' ' + styles.position}>
        <div className={styles.label}>职位</div> 
        <div className={styles.vr}></div> 
        <input type="text" name="position" placeholder="请输入您的职位（选填）" />
      </div> 
      <div className={styles.confirm}>确认修改</div>
    </div>
  );
}

Modify.propTypes = {
};

export default connect()(Modify);
