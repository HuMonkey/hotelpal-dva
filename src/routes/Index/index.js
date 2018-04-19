import moment from 'moment';
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import Slider from 'react-slick';

import arrow from '../../assets/arrow-right.svg';
import { BottomBar } from '../../components/';

function IndexPage({ common, index }) {
  if (!index) {
    return <div></div>
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    draggable: false,
  };
  
  return (
    <div className={styles.normal}>
      <BottomBar selected={0}></BottomBar>
      <Slider className={styles.slider} {...settings}>
        <div><img src="http://img.hotelpal.cn/1509955038138.jpg"/></div>
        <div><img src="http://img.hotelpal.cn/1509955038138.jpg"/></div>
        <div><img src="http://img.hotelpal.cn/1509955038138.jpg"/></div>
      </Slider>
      <div className={styles.open}>
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
      </div>
      <div className={styles.free}>
        <div className={styles.header}>
          <div className={styles.inner}>
            <div className={styles.item}>成长专栏&nbsp;|&nbsp;免费</div>
            <div className={styles.item}><Link to={`/jdbs`}>查看全部<img src={arrow} /></Link></div>
          </div>
        </div>
        <div className={styles.list}>
          {
            index.innerCourseList.map((d, i) => {
              const time = moment(d.publishTime).format('MM-DD');
              return <div key={i} className={styles.item}>
                <div className={styles.cell}>
                  <div className={styles.arrow}></div>
                  {d.title}
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
            index.courseList.map((d, i) => {
              return <div key={i} className={styles.item}>
                <div className={styles.avatar} style={{ backgroundImage: `url(${d.headImg})` }}></div>
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
            })
          }
        </div>
      </div>
    </div>
  );
}

IndexPage.propTypes = {
};

const mapStateToProps = (state) => {
  return { common: state.common, index: state.index };
}

export default connect(mapStateToProps)(IndexPage);
