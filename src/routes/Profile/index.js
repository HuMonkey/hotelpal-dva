import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import bg from '../../assets/profile_bg.png';
import { BottomBar } from '../../components/';

function Profile() {
  return (
    <div className={styles.normal}>
      <BottomBar selected={2}></BottomBar>
      <div className={styles.banner}>
        <img src={bg} />
      </div>
      <div className={styles.header}>
        <div className={styles.avater}>
          <div className={styles.img + ' ' + styles.short}>
            <img src="http://img.hotelpal.cn/1505554345809.JPG" />
          </div>
        </div> 
        <Link to={'/modify'}><div className={styles.name}>
          逐梦少年1003
          <div className={styles.arrowRight}></div>
        </div> </Link>
        <div className={styles.record}>
          <div className={styles.icon}></div> 
          <span>累计学习</span>
          13小时52分钟
        </div> 
        <div className={styles.infos}>
          <div className={styles.item}>
            <div className={styles.value}>201天</div> 
            <div className={styles.label}>加入成长营</div>
          </div> 
          <div className={styles.item}>
            <div className={styles.value}>5个</div> 
            <div className={styles.label}>报名课程</div>
          </div> 
          <div className={styles.item}>
            <div className={styles.value}>21节</div> 
            <div className={styles.label}>学习课时</div>
          </div>
        </div>
      </div>
      <Link to={`/br`}><div className={styles.row + ' ' + styles.bought}>
        <div className={styles.icon + ' ' + styles.shoppingcar}></div>
          购买记录
        <div className={styles.arrowRight}></div>
      </div></Link>
      <Link to={`/about`}><div className={styles.row + ' ' + styles.about}>
        <div className={styles.icon + ' ' + styles.jiudianbang}></div>
          关于成长营
        <div className={styles.arrowRight}></div>
      </div></Link>
      <div className={styles.hr}><div className={styles.inner}></div></div>
      <Link to={`/wechat`}><div className={styles.row + ' ' + styles.wechat}>
        <div className={styles.icon + ' ' + styles.gongzhonghao}></div>
          关注公众号
        <div className={styles.arrowRight}></div>
      </div></Link>
    </div>
  );
}

Profile.propTypes = {
};

export default connect()(Profile);
