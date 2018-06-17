import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import banner from '../../assets/jdbs-banner.png';
import { getAudioLength, throttle, dispatchWechatShare, isIphoneX } from '../../utils';

class Jdbs extends Component {
  constructor (props) {
    super(props);
    this.state = {
      start: 0,
      n: 10,
      order: 'desc',
      loading: false,
    }
  }

  async componentDidMount () {
    this.refs.jdbs.addEventListener('scroll', throttle(this.handleScroll.bind(this), 1000));
    this.updateCourse([]);

    const { dispatch } = this.props;

    const dict = {
      title: '成长专栏',
      link: location.href,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '给你新的启发与思考，周一到周五更新。',
    }

    dispatchWechatShare(dict, dispatch);

  }

  updateCourse (courses) {
    const { dispatch } = this.props;
    const { start, n, order } = this.state;
    this.setState({
      loading: true
    });
    const that = this;
    dispatch({
      type: 'jdbs/fetchCourseList',
      payload: {
        data: {
          start, n, order, courses
        }
      },
      onResult () {
        that.setState({
          loading: false,
          start: start + n,
        });
      }
    });
  }

  changeOrder () {
    const {order} = this.state;
    const newOrder = order === 'desc' ? 'asc' : 'desc';
    this.setState({
      order: newOrder,
      start: 0,
    }, () => {
      this.updateCourse([])
    })
  }

  handleScroll (ev) {
    const { jdbs } = this.props;
    if (!jdbs.hasMore) {
      return false;
    }
    const scrollTop = this.refs.jdbs.scrollTop;
    const height = this.refs.jdbs.offsetHeight;
    const listHeight = this.refs.list.offsetHeight;
    if (scrollTop + height > listHeight) {
      this.updateCourse(jdbs.courses);
    }
  }

  componentWillUnmount () {
    const {dispatch} = this.props;
    dispatch({
      type: 'jdbs/reset',
    })
  }

  render () {
    const { loading } = this.state;
    const { jdbs } = this.props;
    if (!jdbs) {
      return <div></div>
    }
  
    const { courses, hasMore, total, unListenedCount } = jdbs;

    const width = window.innerWidth;
    const elementHeight = width / 10 * 1.82;
    const containerHeight = elementHeight * 10;

    const iphoneXClass = isIphoneX() ? ' ' + styles.iphonex : '';
  
    return (
      <div className={styles.normal + iphoneXClass} ref={`jdbs`}>
        <div className={styles.header}>
          <img src={banner} />
        </div>
        <div className={styles.toolbar}>
          <div className={styles.tips}>已更新{total}条</div> 
          <div className={styles.sort}>
            <div className={styles.icon} onClick={this.changeOrder.bind(this)}></div>
            倒序
          </div>
        </div>
        <ul className={styles.list} ref={'list'}>
          {
            courses.map((d, i) => {
              const audioLen = getAudioLength(d.audioLen);
              return <li key={i} className={styles.item}>
                <Link to={`/lesson/free/${d.id}`}>
                  <div className={styles.name}>
                    <div className={styles.arrow}></div> 
                    <span>{d.lessonNo}</span>
                    <span className={styles.vr}>|</span>
                    <span>{d.title}</span>
                  </div> 
                  <div className={styles.infos}>
                    <span>{d.publishTime}</span> 
                    <span>{d.resourceSize}</span> 
                    <span>{audioLen}</span> 
                    {
                      d.listenLen && d.listenLen >= d.audioLen && <span className={styles.over}>已播完</span>
                    }
                    { 
                      d.listenLen && d.listenLen < d.audioLen && <span className={styles.ing}>已播{ parseInt(d.listenLen / d.audioLen * 100) }%</span>
                    }
                  </div>
                  <div className={styles.arrowRight}></div>
                </Link>
              </li>
            })
          }
        </ul>
        { loading && <div className={styles.loading}>加载中...</div> }
        <div className={styles.btns}>
          <div className={styles.item + ' ' + styles.home}>
            <Link to={`/`}>
              <div className={styles.icon}></div>
              <span>首页</span>
            </Link>
          </div> 
          <div className={styles.item + ' ' + styles.left}>
            <div className={styles.icon}></div>
            {unListenedCount}条未听
          </div>
        </div>
      </div>
    );
  }
}

Jdbs.propTypes = {
};

const mapStateToProps = (state) => {
  return { jdbs: state.jdbs };
}

export default connect(mapStateToProps)(Jdbs);
