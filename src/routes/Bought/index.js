import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import { BottomBar } from '../../components/';

function Bought() {
  return (
    <div className={styles.normal}>
      <BottomBar selected={1}></BottomBar>
      <div className={styles.nothing}>
        <div className={styles.shoppingCar}></div>
        <p>你还没有购买课程</p>
        <Link to={`/`}>
          <div className={styles.buy}>
            <div className={styles.magnifier}></div>
            发现课程
          </div>
        </Link>
      </div>
      { false && <div>
        <div className={styles.list}>
          <table>
            <tbody>
              <tr>
                <td>
                <div className={styles.item}>
                    <div className={styles.img} style={{backgroundImage: `url('http://img.hotelpal.cn/1503392076725.jpg')`, }}></div> 
                    <div className={styles.main}>
                      <div className={styles.title}>服务创新设计课</div> 
                      <div className={styles.tips}>暂无</div> 
                      <div className={styles.time}>
                        <span>10-08更新&nbsp;|&nbsp;</span>已发布 1/16
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.item}>
                    <div className={styles.img} style={{backgroundImage: `url('http://img.hotelpal.cn/1503392076725.jpg')`, }}></div> 
                    <div className={styles.main}>
                      <div className={styles.title}>服务创新设计课</div> 
                      <div className={styles.tips}>暂无</div> 
                      <div className={styles.time}>
                        <span>10-08更新&nbsp;|&nbsp;</span>已发布 1/16
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                <div className={styles.item}>
                    <div className={styles.img} style={{backgroundImage: `url('http://img.hotelpal.cn/1503392076725.jpg')`, }}></div> 
                    <div className={styles.main}>
                      <div className={styles.title}>服务创新设计课</div> 
                      <div className={styles.tips}>暂无</div> 
                      <div className={styles.time}>
                        <span>10-08更新&nbsp;|&nbsp;</span>已发布 1/16
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.item}>
                    <div className={styles.img} style={{backgroundImage: `url('http://img.hotelpal.cn/1503392076725.jpg')`, }}></div> 
                    <div className={styles.main}>
                      <div className={styles.title}>服务创新设计课</div> 
                      <div className={styles.tips}>暂无</div> 
                      <div className={styles.time}>
                        <span>10-08更新&nbsp;|&nbsp;</span>已发布 1/16
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.more}>
          <Link to={`/`}>
            <div className={styles.buy}>
              <div className={styles.magnifier}></div>
              发现更多课程
            </div>
          </Link>
        </div>
      </div> }
    </div>
  );
}

Bought.propTypes = {
};

export default connect()(Bought);
