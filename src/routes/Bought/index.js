import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './index.less';

import { BottomBar } from '../../components/';

function Bought({ bought }) {
  if (!bought) {
    return <div></div>
  }

  const { boughtList } = bought;
  console.log(boughtList);

  let mainDom;
  if (!boughtList || boughtList.length === 0) {
    mainDom = <div className={styles.nothing}>
      <div className={styles.shoppingCar}></div>
      <p>你还没有购买课程</p>
      <Link to={`/`}>
        <div className={styles.buy}>
          <div className={styles.magnifier}></div>
          发现课程
        </div>
      </Link>
    </div>
  } else {
    const temp = boughtList.slice(0, Math.ceil(boughtList.length / 2));
    mainDom = (
      <div className={styles.list}>
        <table>
          <tbody>
            {
              temp.map((d, i) => {
                const list = boughtList.slice(i * 2, i * 2 + 2);
                return <tr key={i}>
                  {
                    list.map((dd, ii) => {
                      const now = moment();
                      const date = moment(dd.updateDate);
                      const dateStr = date.year() === now.year() ? date.format('MM-DD') : date.format('YYYY-MM-DD');
                      return <td key={ii}>
                        <Link to={`/course/${dd.id}`}>
                          <div className={styles.item}>
                            <div className={styles.img} style={{backgroundImage: `url('${dd.bannerImg[0]}')`, }}></div> 
                            <div className={styles.main}>
                              <div className={styles.title}>{dd.title}</div> 
                              <div className={styles.tips}>{dd.msg || '暂无'}</div> 
                              <div className={styles.time}>
                                <span>{dateStr}更新&nbsp;|&nbsp;</span>已发布 {dd.publishedLessonCount}/{dd.lessonCount}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                    })
                  }
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={styles.normal}>
      <BottomBar selected={1}></BottomBar>
      {
        mainDom
      }
    </div>
  );
}

Bought.propTypes = {
};

const mapStateToProps = (state) => {
  return { bought: state.bought };
}

export default connect(mapStateToProps)(Bought);
