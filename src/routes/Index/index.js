import moment from 'moment';
import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import Slider from 'react-slick';

import arrow from '../../assets/arrow-right.svg';
import { BottomBar } from '../../components/';
import { dispatchWechatShare } from '../../utils/';

import { Icon } from 'antd';

let mark, touchPos;

const liveStatus = {
  ENROLLING: '报名中',
  ONGOING: '直播中',
  ENDED: '已结束',
}

class IndexPage extends Component {
  constructor (props) {
    super(props);
    this.state = {}
  }

  async componentDidMount () {
    const { dispatch } = this.props;
    const dict = {
      title: '酒店邦成长营',
      link: location.protocol + '//' + location.hostname,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    dispatchWechatShare(dict, dispatch);
  }

  onTouchStart (event) {
    mark = new Date();
    touchPos = event.nativeEvent.changedTouches[0];
  }

  onTouchEnd (event, data) {
    const now = new Date();
    const currentTouchPos = event.nativeEvent.changedTouches[0];
    if (now - mark > 100) {
      if (touchPos.clientX > currentTouchPos.clientX) {
        this.refs.slider.slickNext();
      } else {
        this.refs.slider.slickPrev();
      }
    } else {
      window.location = data.link;
    }
  }

  render () {
    const { common, index, live } = this.props;
    if (!index) {
      return <div></div>
    }
  
    const settings = {
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      draggable: false,
      touchMove: false,
    };
  
    const { courseList, innerCourseList, bannerList = [] } = index;

    const liveList = live.list || [];

    return (
      <div className={styles.normal}>
        <BottomBar selected={0}></BottomBar>
        <Slider className={styles.slider} {...settings} ref={'slider'}>
          {
            bannerList.map((d, i) => {
              return <div
                key={d.bannerOrder} 
                onTouchEnd={(event) => this.onTouchEnd.call(this, event, d)} 
                onTouchStart={this.onTouchStart.bind(this)}
              ><img src={d.bannerImg}/></div>
            })
          }
        </Slider>
        { true && <div className={styles.open}>
          <div className={styles.header}>
            <div className={styles.inner}>
              <div className={styles.item}>公开课&nbsp;|&nbsp;直播</div>
            </div>
          </div>
          <div className={styles.list}>
            {
              liveList.map((d, i) => {
                moment.locale('zh-cn');
                const openTime = moment(d.openTime);
                const openTimeStr = openTime.format('MM-DD');
                const openTimeWeekStr = openTime.format('dddd');
                const openTimeHourStr = openTime.format('HH:mm');

                const count = (d.vipEnrolledTimes || 0) 
                  + (d.purchasedTimes || 0) 
                  + (d.freeEnrolledTimes || 0);

                return <div className={styles.item} key={i} onClick={() => {
                  location.href = `/?t=${(new Date()).valueOf()}#/live/${d.id}`
                }}>
                  <div className={styles.top}>
                    <div className={styles.left}>
                      <div className={styles.tag + ' ' + styles[d.status]}>
                        {/* {liveStatus[d.status]} */}
                        {/* <div className={styles.tri}></div> */}
                      </div>
                      <div className={styles.time}>{openTimeStr}&nbsp;{openTimeWeekStr}&nbsp;{openTimeHourStr}</div>
                    </div>
                    { d.status === 'ENROLLING' && <div className={styles.right}>已有{count}人报名</div> }
                    { d.status === 'ONGOING' && <div className={styles.right}>{d.present}人正在收看</div> }
                    { d.status === 'ENDED' && <div className={styles.right}>累计{d.totalPeople}人收看</div> }
                  </div>
                  <div className={styles.detail}>
                    <div className={styles.title}>{d.title}</div>
                    <div className={styles.infos}>{d.speakerTitle}&nbsp;{d.speakerNick}&nbsp;{d.subTitle}</div>
                    { d.status === 'ENROLLING' && <div className={styles.arrowRight}></div> }
                    { d.status === 'ONGOING' && <div className={styles.rightIng}></div> }
                    { d.status === 'ENDED' && <div className={styles.rightEnd}></div> }
                  </div>
                </div>
              })
            }
          </div>
        </div> }
        <div className={styles.free}>
          <div className={styles.header}>
            <div className={styles.inner}>
              <div className={styles.item}>成长专栏&nbsp;|&nbsp;免费</div>
              <div className={styles.item}><Link to={`/jdbs`}>查看全部<img src={arrow} /></Link></div>
            </div>
          </div>
          <div className={styles.list}>
            {
              innerCourseList.map((d, i) => {
                const time = moment(d.publishTime).format('MM-DD');
                return <div key={i} className={styles.item}>
                  <div className={styles.cell}>
                    <Link to={`/lesson/free/${d.id}`}>
                      <div className={styles.arrow}></div>
                      {d.title}
                    </Link>
                  </div>
                  <div className={styles.cell}>
                    {/* {time} */}
                  </div>
                </div>
              })
            }
          </div>
        </div>
        <div className={styles.courses}>
          <div className={styles.header}>
            <div className={styles.inner}>
              <div className={styles.item}>订阅专栏</div>
            </div>
          </div>
          <div className={styles.list}>
            {
              courseList.map((d, i) => {
                let stateDom = null;
                if (d.status == 0) {
                  stateDom = <div className={styles.state + ' ' + styles.coming}>预告</div>;
                } else if (d.status == 2) {
                  stateDom = <div className={styles.state + ' ' + styles.isnew}>上新</div>;
                }
                return <Link key={i} to={`/course/${d.id}`}>
                  <div className={styles.item}>
                    <div className={styles.avatar} style={{ backgroundImage: `url(${d.headImg})` }}>
                      {stateDom}
                    </div>
                    <div className={styles.right}>
                      <div className={styles.title}>{d.title}</div>
                      <div className={styles.who}>
                        <span>{d.userName}</span>
                        <span className={styles.split}>&nbsp;·&nbsp;</span>
                        <span>{d.company + ' ' + d.userTitle}</span>
                      </div>
                      <div className={styles.slogan}>{d.subtitle}</div>
                      <div className={styles.bottom}>
                        <div className={styles.tags}>
                          {
                            d.tag && d.tag.map((dd, ii) => {
                              return <div key={ii} className={styles.tag}>{dd.name}</div>
                            })
                          }
                        </div>
                        <div className={styles.price}>￥{d.charge / 100} / {d.lessonCount}课时</div>
                      </div>
                    </div>
                  </div>
                </Link>
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
};

const mapStateToProps = (state) => {
  return { index: state.index, live: state.live };
}

export default connect(mapStateToProps)(IndexPage);
