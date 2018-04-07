import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import Slider from 'react-slick';

import arrow from '../../assets/arrow-right.svg';
import { BottomBar } from '../../components/';

function IndexPage() {
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
      <div className={styles.free}>
        <div className={styles.header}>
          <div className={styles.inner}>
            <div className={styles.item}>成长专栏&nbsp;|&nbsp;免费</div>
            <div className={styles.item}><Link to={`/jdbs`}>查看全部<img src={arrow} /></Link></div>
          </div>
        </div>
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.cell}>
              <div className={styles.arrow}></div>
              一直被唱衰的经济型酒店，出路究竟在哪？
            </div>
            <div className={styles.cell}>
              01-25
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.cell}>
              <div className={styles.arrow}></div>
              一直被唱衰的经济型酒店，出路究竟在哪？
            </div>
            <div className={styles.cell}>
              01-25
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.cell}>
              <div className={styles.arrow}></div>
              一直被唱衰的经济型酒店，出路究竟在哪？
            </div>
            <div className={styles.cell}>
              01-25
            </div>
          </div>
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
            [1, 1, 1, 1].map((d, i) => {
              return <div key={i} className={styles.item}>
                <div className={styles.avatar}></div>
                <div className={styles.right}>
                  <div className={styles.title}>酒店电商公式从0到1</div>
                  <div className={styles.who}>
                    <span>葛健</span>
                    <span className={styles.split}>·</span>
                    <span>酒店哥 CEO</span>
                  </div>
                  <div className={styles.slogan}>解决所有电商问题</div>
                  <div className={styles.bottom}>
                    <div className={styles.tags}>
                      <div className={styles.tag}>电商1</div>
                      <div className={styles.tag}>电商2</div>
                    </div>
                    <div className={styles.price}>￥197 / 18课时</div>
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

export default connect()(IndexPage);
