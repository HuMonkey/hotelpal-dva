import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { Navs } from '../../components';

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterShow: false,
      page: 'detail', // detail or chat
      signup: 'init', // inviting init paid vip free
      state: 'ing', // before ing after
    };
  }

  openPoster () {
    this.setState({
      posterShow: true,
    })
  }

  closePoster () {
    this.setState({
      posterShow: false,
    })
  }

  changePage (page) {
    this.setState({
      page
    })
  }

  render () {
    const { posterShow, page, signup } = this.state;

    const detailClass = page === 'detail' ? ' ' + styles.active : '';
    const chatClass = page === 'chat' ? ' ' + styles.active : '';

    const invitingDom = signup === 'init' ? (
      <div className={styles.item}>
        <div className={styles.left}>
          <div className={styles.inner}>邀请5个好友可以免费</div>
        </div>
        <div className={styles.right}>我要免费报名</div>
      </div>
    ) : (
      <div className={styles.item + ' ' + styles.big}>
        <div className={styles.left}>
          <div className={styles.inner}>{ signup === 'inviting' ? `再邀请2个好友即可免费` : `你已经邀请了五个好友，报名成功！`}</div>
          <div className={styles.users}>
            <div className={styles.avatar}></div>
            <div className={styles.avatar}></div>
            <div className={styles.avatar}></div>
            <div className={styles.avatar}></div>
            <div className={styles.avatar}></div>
          </div>
        </div>
        { signup === 'inviting' && <div className={styles.right + ' ' + styles.big}>我要免费报名</div> }
      </div>
    ); // 邀请中的样式

    return (
      <div className={styles.normal}>
        <Navs/>
        <div className={styles.banner}>
          <div className={styles.count}>
            <div className={styles.icon}></div>
            <div className={styles.label}>倒计时</div>
            <div className={styles.tick}>
              <span className={styles.item}>00</span>
              :
              <span className={styles.item}>02</span>
              :
              <span className={styles.item}>26</span>
              :
              <span className={styles.item}>24</span>
            </div>
          </div>
        </div>
        <div className={styles.switches}>
          <div 
            className={styles.item + detailClass} 
            onClick={() => this.changePage.call(this, 'detail')}>
            课程
          </div>
          <div className={styles.item + chatClass} onClick={() => this.changePage.call(this, 'chat')}>互动</div>
        </div>
        {
          page === 'detail' && <div>
            <div className={styles.course}>
              <div className={styles.left}>
                <div className={styles.tag + ' ' + styles.before}>
                  直播中
                  <div className={styles.tri}></div>
                </div>
                <div className={styles.time}>03-19&nbsp;周四&nbsp;20:00</div>
              </div>
              { signup === 'paid' || signup === 'free' ? <div className={styles.paid}></div> : <div className={styles.right}>已有200000人报名</div> }
            </div>
            { 
              signup === 'paid' || signup === 'init' && <div className={styles.signups}>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.inner}>直播价&nbsp;￥49</div>
                  </div>
                  <div className={styles.right}>我要付费报名</div>
                </div>
                {
                  invitingDom
                }
              </div>
            }
            {
              signup === 'vip' && <div className={styles.signups}>
                <div className={styles.item + ' ' + styles.vip}>
                  <div className={styles.left}>
                    <div className={styles.inner}>
                      <span className={styles.price}>￥49</span>
                      你是公开课会员，可以免费收看
                    </div>
                  </div>
                  <div className={styles.right}>报名</div>
                </div>
              </div>
            }
            {
              signup === 'free' && <div className={styles.signups}>
                { invitingDom }
              </div>
            }
            <div className={styles.intro}>
              <div className={styles.title}>公开课介绍</div>
              <div className={styles.content}>介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍</div>
            </div>
            <div className={styles.know}>
              <div className={styles.title}>公开课须知</div>
              <div className={styles.content}>介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍</div>
            </div>
          </div>
        }
        {
          page === 'chat' && <div>
            互动
          </div>
        }
        {
          posterShow && <div className={styles.poster}>
            <div className={styles.main}>
              <div className={styles.header}>
                <div className={styles.numbers}>
                  <div className={styles.vl}></div>
                  <div className={styles.item}>1</div>
                  <div className={styles.item}>2</div>
                  <div className={styles.item}>3</div>
                </div>
                <div className={styles.row}>将专属邀请卡分享给好友</div>
                <div className={styles.row}>5个好友点击报名（免费/付费均可）</div>
                <div className={styles.row}>可享受免费报名！</div>
              </div>
              <div className={styles.image}></div>
              <div className={styles.btn}>长按保存图片</div>
            </div>
            <div className={styles.close} onClick={this.closePoster.bind(this)}></div>
          </div>
        }
      </div>
    );
  }
}

Live.propTypes = {
};

export default connect()(Live);
