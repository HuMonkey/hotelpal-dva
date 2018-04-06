import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import banner from '../../assets/jdbs-banner.png';

function Jdbs() {
  return (
    <div className={styles.normal}>
      <div className={styles.header}>
        <img src={banner} />
      </div>
      <div className={styles.toolbar}>
        <div className={styles.tips}>已更新23条</div> 
        <div className={styles.sort}>
          <div className={styles.icon}></div>
          倒序
        </div>
      </div>
      <ul className={styles.list}>
        {
          [1, 1, 1, 1].map((d, i) => {
            return <li key={i} className={styles.item}>
              <div className={styles.name}>
                <div className={styles.arrow}></div> 
                <span>23</span>
                <span className={styles.vr}>|</span>
                <span>一直被唱衰的经济型酒店，出路究竟在哪？</span>
              </div> 
              <div className={styles.infos}>
                <span>2018-01-25</span> 
                <span>10.6 MB</span> 
                <span>11:35</span> 
              </div>
              <div className={styles.arrowRight}></div>
            </li>
          })
        }
      </ul>
      <div className={styles.btns}>
        <div className={styles.item + ' ' + styles.home}>
          <Link to={`/`}>
            <div className={styles.icon}></div>
            <span>首页</span>
          </Link>
        </div> 
        <div className={styles.item + ' ' + styles.left}>
          <div className={styles.icon}></div>
          10条未听
        </div>
      </div>
    </div>
  );
}

Jdbs.propTypes = {
};

export default connect()(Jdbs);
