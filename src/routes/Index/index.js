import moment from 'moment';
import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import Slider from 'react-slick';

import arrow from '../../assets/arrow-right.svg';
import { BottomBar } from '../../components/';
import { configWechat, updateWechartShare } from '../../utils/';

class IndexPage extends Component {
  constructor (props) {
    super(props);
    this.state = {}
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
    const { common, index } = this.props;
    if (!index) {
      return <div></div>
    }
  
    const settings = {
      dots: true,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      draggable: false,
      touchMove: false,
    };
  
    const { courseList, innerCourseList, bannerList } = index;

    return (
      <div className={styles.normal}>
        <BottomBar selected={0}></BottomBar>
        <Slider className={styles.slider} {...settings}>
          {
            bannerList.map((d, i) => {
              return <a href={d.link} key={i}><img src={d.bannerImg}/></a>
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
            <Link to={`/live/2`}><div className={styles.item}>
              <div className={styles.top}>
                <div className={styles.left}>
                  <div className={styles.tag + ' ' + styles.before}>
                    直播中
                    <div className={styles.tri}></div>
                  </div>
                  <div className={styles.time}>03-19&nbsp;周四&nbsp;20:00</div>
                </div>
                <div className={styles.right}>已有200000人报名</div>
              </div>
              <div className={styles.detail}>
                <div className={styles.title}>一学就会的酒店营销科</div>
                <div className={styles.infos}>Feekr CEO&nbsp;李洋&nbsp;教你策划一场刷屏活动</div>
                <div className={styles.arrowRight}></div>
              </div>
            </div></Link>
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
                    {time}
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
                console.log(d);
                let stateDom = null;
                if (c.status == 0) {
                  stateDom = <div className={styles.state + ' ' + styles.isnew}>上新</div>;
                } else if (c.status == 2) {
                  stateDom = <div className={styles.state + ' ' + styles.coming}>预告</div>;
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
                        <span className={styles.split}>·</span>
                        <span>{d.company + ' ' + d.userTitle}</span>
                      </div>
                      <div className={styles.slogan}>{d.subtitle}</div>
                      <div className={styles.bottom}>
                        <div className={styles.tags}>
                          {
                            d.tag.map((dd, ii) => {
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
  return { index: state.index };
}

export default connect(mapStateToProps)(IndexPage);
