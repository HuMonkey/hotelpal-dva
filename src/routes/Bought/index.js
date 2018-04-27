import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import { BottomBar } from '../../components/';
import { getTimeStr, configWechat, updateWechartShare } from '../../utils/';

class Bought extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount () {
    const { dispatch } = this.props;

    const dict = {
      title: '酒店邦成长营',
      link: location.href,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }

    await dispatch({
      type: 'common/getWechatSign',
      payload: {
        data: {
          url: location.href.split('#')[0]
        }
      },
      onResult (res) {
        if (res.data.code === 0) {
          const {appid, noncestr, sign, timestamp, url} = res.data.data;
          configWechat(appid, timestamp, noncestr, sign, () => {
            updateWechartShare(dict);
          });
        }
      }
    });
  }

  render () {
    const {bought} = this.props;
    if (!bought) {
      return <div></div>
    }
  
    const { boughtList } = bought;
  
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
                        const dateStr = getTimeStr(dd.updateDate);
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
}

Bought.propTypes = {
};

const mapStateToProps = (state) => {
  return { bought: state.bought };
}

export default connect(mapStateToProps)(Bought);
