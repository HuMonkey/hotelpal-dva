import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { Navs } from '../../components';

import { Icon, Input } from 'antd';

class Live extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterShow: false,
      page: 'detail', // detail or chat
      signup: 'init', // inviting init paid vip free
      state: 'ing', // before ing after
      taOpen: false,
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

  switchTa (taOpen) {
    this.setState({
      taOpen
    })
  }

  render () {
    const { posterShow, page, signup, taOpen } = this.state;

    const detailClass = page === 'detail' ? ' ' + styles.active : '';
    const chatClass = page === 'chat' ? ' ' + styles.active : '';
    const taClass = taOpen ? ' ' + styles.open : '';

    const taComments = taOpen ? [1, 1, 1] : [1, 1, 1].slice(0, 1);
    const taDom = taComments.map((d, i) => {
      const hasPic = false;
      const hasPicClass = hasPic ? ' ' + styles.hasPic : '';
      return <div key={i} className={styles.item + hasPicClass}>
        <div className={styles.left}>
          <div className={styles.title}>
            <div className={styles.name}>
              <div className={styles.icon}><div className={styles.tri}></div></div>
              <div className={styles.text}>助教小燕子</div>
            </div>  
            <div className={styles.time}>20:32:43</div>
          </div>  
          <div className={styles.comment}>评论评论评论评论评论评论评论评论评论评论评论评论</div>
        </div>
        { hasPic && <div className={styles.right}></div> }
      </div>
    });

    const comments = [1, 1, 1, 1];
    const commentsDom = comments.map((d, i) => {
      const isMine = i === 2;
      const isMineClass = isMine ? ' ' + styles.mine : '';
      return <div className={styles.item + isMineClass} key={i}>
        <div className={styles.avatar}></div>
        <div className={styles.main}>
          <div className={styles.name}>陈熙慧 酒店邦</div>
          <div className={styles.talk}>
            <div className={styles.inner}>121212121212123123123123123121212121212123123123123123121212121212123123123123123121212121212123123123123123121212121212123123123123123</div>
            <div className={styles.arrow}></div>
          </div>
        </div>
      </div>
    })

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

    const popupDetailDom = <div className={styles.courseDetail}>
      <div className={styles.top}>
        <div className={styles.avatar}></div>
        <div className={styles.right}>
          <div className={styles.title}>课程标题课程标题</div>
          <div className={styles.infos}>
            <div className={styles.tag}>订阅专栏</div>
            <div className={styles.price}>￥199 / 10 课时</div>
          </div>
        </div>
      </div>
      <div className={styles.desc}>
        <div className={styles.label}>主讲人</div>
        <div className={styles.speaker}>李洋<span>feekre ceo</span></div>
        <div className={styles.text}>介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍介绍</div>
      </div>
      <div className={styles.buy}>立即订阅：￥199 / 10 课时</div>
    </div>

    const popupOrderDom = <div className={styles.order}>
      <div className={styles.title}>订单确认</div>
      <div className={styles.box}>
        <div className={styles.avatar}></div>
        <div className={styles.infos}>
          <div className={styles.stitle}>一学就会的酒店营销课</div>
          <div className={styles.speaker}>李洋 feekr CEO</div>
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.row}>
          <div className={styles.left}>课程价格</div>
          <div className={styles.right}>￥199</div>
        </div>
        <div className={styles.row}>
          <div className={styles.left}>优惠</div>
          <div className={styles.right + ' ' + styles.coupon}>-￥20<Icon type="right" className={styles.chooseCoupons} /></div>
        </div>
      </div>
      <div className={styles.row + ' ' + styles.total}>
        <div className={styles.left}>合计</div>
        <div className={styles.right}>￥179</div>
      </div>
      <div className={styles.buy}>确认支付</div>
    </div>

    const popupLoginDom = <div className={styles.login}>
      <div className={styles.title}>快捷登录</div>
      <div className={styles.wrap}>
        <Input className={styles.phone} placeholder={`请输入11位手机号`} />
        <Input className={styles.vCode} placeholder={`请输入验证码`} />
      </div>
      <div className={styles.buy}>登录</div>
    </div>

    return (
      <div className={styles.normal}>
        {
          true && <div className={styles.popup}>
            <div className={styles.content}>
              <Icon type="left" size={`large`} className={styles.back} />
              <Icon type="close" size={`large`} className={styles.close} />
              {popupLoginDom}
            </div>
          </div>
        }
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
            <div className={styles.ta + taClass}>
              <div>
                {taDom}
              </div>
              <div className={styles.more}>
                { taOpen && <Icon onClick={() => this.switchTa.call(this, false)} type="up" /> }
                { !taOpen && <Icon onClick={() => this.switchTa.call(this, true)} type="down" /> }
              </div>
            </div>
            <div className={styles.comments}>
              {!taOpen && commentsDom}
            </div>
          </div>
        }
        { 
          page === 'chat' && <div className={styles.commentBox}>
            <div className={styles.hongbao}>
              <div className={styles.inner}>
                <div className={styles.square}>
                  <div className={styles.money}>￥<span>20</span></div>
                  <div className={styles.btn}>抢</div>
                  <div className={styles.time}>11:12:15</div>
                </div>
                <div className={styles.bubble1}></div>
                <div className={styles.bubble2}></div>
                <div className={styles.bubble3}></div>
                <div className={styles.bubble4}></div>
              </div>
            </div>
            <div className={styles.input}>
              <div className={styles.pen}></div> 
              <input type="text" name="comment" placeholder="一起来参与讨论吧！" />
            </div>
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
