import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import jdb from '../../assets/jiudianbang-big.png';
import { formatNum, getAudioLength } from '../../utils';

class Course extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount () {
    const {dispatch} = this.props;
    dispatch({
      type: 'course/reset',
    })
  }

  render () {
    const { course } = this.props;

    if (!course) {
      return <div></div>
    }
  
    const { detail } = course;
    if (!detail.bannerImg) {
      return <div></div>
    }
  
    return (
      <div className={styles.normal}>
        <div className={styles.header}>
          <img src={`${detail.bannerImg[0]}`} />
          <div className={styles.desc}>
            <div className={styles.title}>{detail.userName}</div> 
            <div className={styles.subTitle}>{detail.company} {detail.userTitle}</div>
          </div>
        </div>
        <div className={styles.gotoDetail}>
          <div className={styles.title}>{detail.title}</div> 
          <div className={styles.subTitle}>{detail.subtitle}</div> 
          <div className={styles.arrow}></div>
        </div>
        <div className={styles.lessons}>
          <div className={styles.title}>课时内容</div>
          <div className={styles.list}>
            {
              detail.lessonList.map((d, i) => {
                return <div key={i} className={styles.item}>
                  <Link to={`/lesson/pay/${d.id}?courseId=${detail.id}`}>
                    <div className={styles.up}>
                      <span className={styles.ltitle}>{formatNum(d.lessonOrder)}&nbsp;|&nbsp;{d.title}</span> 
                      {d.freeListen === 1 && <span className={styles.tag}>免费试听</span>}
                    </div> 
                    <div className={styles.down}>
                      <p>
                        <span>{d.publishTime}</span> 
                        <span>{d.resourceSize}</span> 
                        <span>{getAudioLength(d.audioLen)}</span> 
                        {
                          d.listenLen && d.listenLen >= d.audioLen && <span className={styles.over}>已播完</span>
                        }
                        { 
                          d.listenLen && d.listenLen < d.audioLen && <span className={styles.ing}>已播{ parseInt(d.listenLen / d.audioLen * 100) }%</span>
                        }
                      </p>
                    </div> 
                    <div className={styles.arrow}></div>
                  </Link>
                </div>
              })
            }
          </div>
          <div className={styles.hr}></div>
        </div>
        <div className={styles.back}>
          <Link to={'/'}>
            <div className={styles.box}>
              <img src={jdb} /> 
              <div className={styles.title}>酒店邦成长营</div> 
              <div className={styles.desc}>为你提供高效、省时的知识服务</div> 
              <div className={styles.arrow}></div>
            </div>
          </Link>
        </div>
      </div>
    ); 
  }
}

Course.propTypes = {
};

const mapStateToProps = (state) => {
  return { course: state.course };
}

export default connect(mapStateToProps)(Course);
