import React, {Component} from 'react';
import { connect } from 'dva';
import { Icon, Input } from 'antd';
import styles from './index.less';

import moneyIcon from '../../assets/invite-money.svg';
import couponEmpty from '../../assets/coupon-empty.png';
import { BackBtn } from '../../components';

class InvitePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  render() {
    const {open} = this.state;

    const rp = <div className={styles.rp}>
      <div className={styles.stitle}>优惠券</div>
      <div className={styles.price}><span>20</span>元</div>
      <div className={styles.tips}>所有订阅专栏可用</div>
    </div>

    const gotDom = <div>
      <div>
        <div className={styles.text}>恭喜您！</div>
        <div className={styles.text}>获得一张优惠券</div>
      </div>
      { rp }
      <div className={styles.label1}>优惠券已经放入您的账号18768114210</div>
    </div>;

    const lateDom = <div>
      <div>
        <div className={styles.text}>来晚了</div>
        <div className={styles.text}>优惠券已领完</div>
      </div>
      <img className={styles.latePng} src={couponEmpty} />
    </div>;

    const oldDom = <div className={styles.old}>
      <div className={styles.white}></div>
      <div className={styles.text}>您已经注册过了</div>
    </div>;

    if (open) {
      return <div className={styles.open}>
        {oldDom}
        <div className={styles.label}>您可以</div>
        <div className={styles.btn}>
          推荐好友得20元
          <img src={moneyIcon} className={styles.money} />
          <Icon className={styles.icon} type="right" />
        </div>
        <BackBtn />
      </div>
    }

    return (
      <div className={styles.normal}>
        <div className={styles.main}>
          <div>
            <Icon className={styles.plus} type="plus" />
            <Icon className={styles.plus} type="plus" />
            <Icon className={styles.plus} type="plus" />
            <Icon className={styles.plus} type="plus" />
          </div>
          <div className={styles.inner1}><div className={styles.border} /></div>
          <div className={styles.inner2}>
            <div className={styles.border} />
          </div>
          <div className={styles.title}>
            <span>邀请函</span>
          </div>
          <div className={styles.text}>我是<span>胡浇浇</span></div>
          <div className={styles.text}>正在<span>“酒店邦成长营”</span>学习</div>
          <div className={styles.text}>邀请你成为我的同学</div>
          <div className={styles.text + ' ' + styles.last}>让我们一起成长</div>
          <div className={styles.tips}>注册成新用户，即可得</div>
          { rp }
          <div className={styles.wrap1}><Input className={styles.input} placeholder="请输入11位手机号" size="large" /></div>
          <div className={styles.wrap2}><Input className={styles.input} placeholder="请输入验证码" size="large" /></div>
          <div className={styles.btn}>快捷注册</div>
          <div className={styles.tips2}>点击登录代表您已阅读并同意<span>《酒店邦成长营》会员条款</span></div>
        </div>
      </div>
    );
  }
}

InvitePage.propTypes = {
};

export default connect()(InvitePage);
