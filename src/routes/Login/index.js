import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import logo from '../../assets/jiudianbang-big.png'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 2,
    };
  }

  render() {
    const { step } = this.state;
    return (
      <div className={styles.normal}>
        { 
          step === 1 && <div className={styles.step + ' ' + styles.first}>
            <div className={styles.logo}>
              <img src={logo} />
            </div>
            <div className={styles.phone}>
              <input type="number" name="phone" placeholder="请输入11位手机号" />
            </div>
            <div className={styles.verify}>
              <input type="number" name="verify" placeholder="请输入验证码" />
              <div className={styles.btn}>获取验证码</div>
            </div>
            <div className={styles.login}>登录</div>
            <div className={styles.tips}>点击 [登录] 代表您已阅读并同意《酒店邦成长营会员条款》</div>
          </div> 
        }
        {
          step === 2 && <div className={styles.step + ' ' + styles.second}>
            <div className={styles.welcome}>欢迎加入酒店营成长邦！</div>
            <div className={styles.avatar}>
              <img src={`http://img.hotelpal.cn/1505554345809.JPG`}/>
            </div>
            <input className={styles.avatarUpload} type="file"></input>
            <div className={styles.wechatName}>胡娇娇</div>
            <div className={styles.row + ' ' + styles.name}>
              <div className={styles.label}>姓名</div>
              <div className={styles.vr}></div>
              <input type="text" name="name" placeholder="请输入您的姓名" />
            </div>
            <div className={styles.row + ' ' + styles.company}>
              <div className={styles.label}>公司</div>
              <div className={styles.vr}></div>
              <input type="text" name="company" placeholder="请输入您的公司（选填）" />
            </div>
            <div className={styles.row + ' ' + styles.position}>
              <div className={styles.label}>职位</div>
              <div className={styles.vr}></div>
              <input type="text" name="position" placeholder="请输入您的职位（选填）" />
            </div>
            <div className={styles.confirm}>确认</div>
            <div className={styles.skip}>跳过</div>
          </div>
        }
      </div>
    );
  }
}

Login.propTypes = {
};

export default connect()(Login);
