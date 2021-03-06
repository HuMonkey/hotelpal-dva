import React, {Component} from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import isMobilePhone from 'validator/lib/isMobilePhone';
import styles from './index.less';

import { message } from 'antd';

import logo from '../../assets/jiudianbang-big.png';
import { getParam, dispatchWechatShare } from '../../utils';
import { Navs } from '../../components';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      disabled: true,
      btnText: null,
      init: false,
    };
  }

  componentDidMount () {
    const { dispatch } = this.props;
    const protocol = location.protocol;
    const dict = {
      title: '酒店邦成长营',
      link: protocol + '//' + location.hostname,
      imgUrl: protocol + '//static.hotelpal.cn/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    dispatchWechatShare(dict, dispatch);
  }

  componentDidUpdate () {
    const { init } = this.state;
    const { common } = this.props;
    if (!init && common.userInfo) {
      this.setState({
        init: true,
      })
      if (common.userInfo.phone && location.href.indexOf('/force') === -1) {
        this.jump();
      }
    }
  }

  async getVerifyCode() {
    const { dispatch } = this.props;
    const { disabled, btnText } = this.state;
    if (disabled || btnText !== null) {
      return false;
    }
    const phone = this.refs.phone.value;
    let time = 60;
    this.setState({
      disabled: true,
      btnText: time + '秒'
    });
    let inter = setInterval(() => {
      time--;
      this.setState({
        btnText: time + '秒'
      });
      if (time === 0) {
        clearInterval(inter);
        const phone = this.refs.phone.value;
        const disabled = !isMobilePhone(phone, 'zh-CN');
        this.setState({
          disabled,
          btnText: null,
        });
      }
    }, 1000);
    await dispatch({
      type: 'common/sendCaptcha',
      payload: {
        data: {
          phone
        }
      },
      onResult(res) {
        console.log(res)
      }
    })
  }

  onPhoneInput() {
    const phone = this.refs.phone.value;
    if (!isMobilePhone(phone, 'zh-CN')) {
      this.setState({
        disabled: true,
      })
    } else {
      this.setState({
        disabled: false,
      })
    }
  }

  async jump() {
    const { history, location, dispatch } = this.props;
    const pathname = decodeURIComponent(getParam('pathname', location.search) || '');
    const search = decodeURIComponent(getParam('search', location.search) || '');
    await dispatch({
      type: 'common/fetchUserInfo',
      payload: {},
      onResult() {},
    })
    if (!pathname) {
      history.push({
        pathname: '/'
      })
    } else {
      history.push({
        pathname, search
      });
    }
  }

  async submitVerify () {
    const phone = this.refs.phone.value;
    const code = this.refs.verify.value;

    const { dispatch, location } = this.props;
    let result;
    await dispatch({
      type: 'common/verifyPhone',
      payload: {
        data: {
          phone, code,
        }
      },
      onResult (res) {
        result = res;
      }
    });
    if (result.data.code === 0) {
      // 邀请注册
      if (getParam('invited', location.search) == 1) {
        const nonce = getParam('nonce', location.search)
        await dispatch({
          type: 'common/newInvitedUser',
          payload: {
            data: {
              nonce,
            }
          },
          onResult (res) {
            console.log(res);
          }
        });
      }
      // 新用户
      if (result.data.data.newPhone) {
        this.setState({
          step: 2,
        });
      } else {
        this.jump();
      }
    } else {
      message.error(result.data.messages || '绑定手机出错，请检查验证码是否正确');
    }
  }

  fileInputClick () {
    this.refs.file.click();
  }

  fileInputChange () {
    const { dispatch, common } = this.props;
    const { userInfo } = common;
    const fileInput = this.refs.file;
    const data = new FormData();
    data.append('imgFile', fileInput.files[0])
    dispatch({
      type: 'common/uploadAvatar',
      payload: { data },
      onResult (res) {
        if (res.data.success) {
          dispatch({
            type: 'common/save',
            payload: {
              userInfo: {
                ...userInfo,
                headImg: res.data.vo,
              }
            }
          })
        } else {
          message.error(res.data.messages);
        }
      }
    })
  }

  onSubmit () {
    const { dispatch, common } = this.props;
    const nickname = this.refs.nickname.value;
    const title = this.refs.title.value;
    const company = this.refs.company.value;
    const avatar = common.userInfo.headImg;
    if (!nickname) {
      message.error('昵称不能为空');
      return false;
    }
    const that = this;
    dispatch({
      type: 'common/submitProfileChange',
      payload: {
        data: {
          nickname, title, company, avatar
        }
      },
      onResult (res) {
        if (res.data.code === 0) {
          that.jump();
        } else {
          message.error(res.data.messages);
        }
      }
    })
  }

  render() {
    const { step, disabled, btnText } = this.state;
    const { common } = this.props;
    const { userInfo } = common;

    const disabledClass = disabled ? ' ' + styles.disabled : '';

    return (
      <div className={styles.normal}>
        <Navs/>
        { 
          step === 1 && <div className={styles.step + ' ' + styles.first}>
            <div className={styles.logo}>
              <img src={logo} />
            </div>
            <div className={styles.phone}>
              <input type="number" name="phone" ref={`phone`} onInput={this.onPhoneInput.bind(this)} placeholder="请输入11位手机号" />
            </div>
            <div className={styles.verify}>
              <input type="number" name="verify" ref={'verify'} placeholder="请输入验证码" />
              <div className={styles.btn + disabledClass} onClick={this.getVerifyCode.bind(this)}>{btnText || '获取验证码'}</div>
            </div>
            <div className={styles.login} onClick={this.submitVerify.bind(this)}>登录</div>
            <div className={styles.tips}>点击 [登录] 代表您已阅读并同意《酒店邦成长营会员条款》</div>
          </div> 
        }
        {
          step === 2 && userInfo && <div className={styles.step + ' ' + styles.second}>
            <div className={styles.welcome}>欢迎加入酒店营成长邦！</div>
            <div className={styles.avatar} 
              onClick={this.fileInputClick.bind(this)}
              style={{
                backgroundImage: `url(${userInfo.headImg})`
              }}
            ></div>
            <input accept="image/*" className={styles.avatarUpload} onChange={this.fileInputChange.bind(this)} type="file" ref={`file`}></input>
            {/* <div className={styles.wechatName}>{userInfo.nickname}</div> */}
            <div className={styles.row + ' ' + styles.name}>
              <div className={styles.label}>姓名</div>
              <div className={styles.vr}></div>
              <input defaultValue={userInfo.nickname} ref={`name`} type="text" name="name" ref={'nickname'} placeholder="请输入您的姓名" />
            </div>
            <div className={styles.row + ' ' + styles.company}>
              <div className={styles.label}>公司</div>
              <div className={styles.vr}></div>
              <input ref={`company`} type="text" name="company" ref={'company'} placeholder="请输入您的公司（选填）" />
            </div>
            <div className={styles.row + ' ' + styles.position}>
              <div className={styles.label}>职位</div>
              <div className={styles.vr}></div>
              <input ref={`position`} type="text" name="position" ref={'title'} placeholder="请输入您的职位（选填）" />
            </div>
            <div className={styles.confirm} onClick={this.onSubmit.bind(this)}>确认</div>
            <div className={styles.skip} onClick={this.jump.bind(this)}>跳过</div>
          </div>
        }
      </div>
    );
  }
}

Login.propTypes = {
};

const mapStateToProps = (state) => {
  return { common: state.common };
}

export default connect(mapStateToProps)(withRouter(Login));
