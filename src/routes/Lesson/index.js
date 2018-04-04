import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function Lesson() {
  return (
    <div className={styles.normal}>
      <div className={styles.paid}>
        <div className={styles.main}>
          <div className={styles.courseTitle}>02&nbsp;|&nbsp;影响流量的九大要素之一（上）</div>
          <div className={styles.infos}>
            <div className={styles.time}>2017-10-09 发布</div> 
            <div className={styles.other}>
              <span>
                <div className={styles.icon + ' ' + styles.time}></div>
                15:11
              </span> 
              <span>
                <div className={styles.icon + ' ' + styles.download}></div>
                7.1 MB
              </span> 
              <span>
                <div className={styles.icon + ' ' + styles.read}></div>
                6
              </span>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.article + ' ' + styles.overflow}>单体酒店更加容易做知名度，因为相比连锁品牌的各种条条框框，单体酒店更加灵活更加没有包袱，如何关于如何提升品牌知名度，单体酒店更加容易做知名度，因为相比连锁品牌的各种条条框框，单体酒店更加灵活更加没有包袱，如何关于如何提升品牌知名度，在第5节课单体酒店更加容易做知名度，因为相比连锁品牌的各种条条框框，单体酒店更加灵活更加没有包袱，如何关于如何提升品牌知名度，在第5节课在第5节课</div>
            <div className={styles.open}>查看完整介绍</div>
            <div className={styles.hr}></div>
            <div className={styles.course}>
              <div className={styles.back}>
                <div className={styles.box}>
                  <div className={styles.img}>
                    <img src="http://img.hotelpal.cn/1509937424911.jpg" />
                  </div> 
                  <div className={styles.title}>酒店电商万能公式从0到1</div> 
                  <div className={styles.desc}>葛健 · 酒店哥 CEO</div> 
                  <div className={styles.arrow}></div>
                </div>
              </div> 
              <div className={styles.hr}></div> 
              <div className={styles.lessons}>
                <div className={styles.swiper}>
                  <div className={styles.item}>
                    <div className={styles.inner}>01 | 什么是酒店电商万能公式？</div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.inner}>01 | 什么是酒店电商万能公式？</div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.inner}>01 | 什么是酒店电商万能公式？</div>
                  </div>
                </div>
              </div>
              <div className={styles.discuss}>
                <div className={styles.all}>
                  <div className={styles.title}>全部讨论</div>
                  <div className={styles.comments}>
                    <div className={styles.item}>
                      <div className={styles.avatar}>
                        <img src="http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJeYou1lgwzmjtF8QLz9Tr3bicNiazUkic8xr8yzic2tVuxl12dibDz59MxmYRvUstQfiavwW0CSYWMfpHA/0" />
                      </div> 
                      <div className={styles.name}>
                        葛健  
                        <span>酒店哥 创始人</span> 
                        <span className={styles.tag}>主讲人</span>
                      </div> 
                      <div className={styles.content}>
                        单体酒店更加容易做知名度，因为相比连锁品牌的各种条条框框，单体酒店更加灵活更加没有包袱，如何关于如何提升品牌知名度，在第5节课
                      </div> 
                      <div className={styles.quote}>
                        当家的：单体酒店没有品牌影响力。比如光大银行下的酒店，是不是酒店名前冠光大俩字，就会提升知名度了？
                      </div> 
                      <div className={styles.bottom}>
                        <div className={styles.time}>4个月前</div> 
                        <div className={styles.box}>
                          <div className={styles.comment}>回复</div>
                          <div className={styles.like}>
                            <div className={styles.icon}></div>3
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> 
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Lesson.propTypes = {
};

export default connect()(Lesson);
