import React, {Component} from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './index.less';

import { message } from 'antd';
import { dispatchWechatShare } from '../../utils';

class Modify extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  uploadClick () {
    this.refs.imgFile.click();
  }

  onFileChange () {
    const { dispatch, common } = this.props;
    const { userInfo } = common;
    const fileInput = this.refs.imgFile;
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
    const { dispatch, history, common } = this.props;
    const nickname = this.refs.nickname.value;
    const title = this.refs.title.value;
    const company = this.refs.company.value;
    const avatar = common.userInfo.headImg;
    if (!nickname) {
      message.error('昵称不能为空');
      return false;
    }
    dispatch({
      type: 'common/submitProfileChange',
      payload: {
        data: {
          nickname, title, company, avatar
        }
      },
      onResult (res) {
        if (res.data.code === 0) {
          message.success('修改成功！');
          history.go(-1);
        }
      }
    })
  }

  componentDidMount () {
    const { dispatch } = this.props;
    const dict = {
      title: '酒店邦成长营',
      link: location.protocol + '//' + location.hostname,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    dispatchWechatShare(dict, dispatch);
  }

  render () {
    const { common } = this.props;
    const { userInfo } = common;

    if (!userInfo) {
      return <div></div>
    }

    return (
      <div className={styles.normal}>
        <div className={styles.avater}>
          <div 
            className={styles.img + ' ' + styles.short} 
            onClick={this.uploadClick.bind(this)}
            style={{
              backgroundImage: `url(${userInfo.headImg})`
            }} 
          ></div>
        </div> 
        <input accept="image/*" type="file" className={styles.avaterUpload} ref={`imgFile`} onChange={this.onFileChange.bind(this)}/> 
        <div className={styles.wechatName}></div> 
        <div className={styles.row + ' ' + styles.name}>
          <div className={styles.label}>姓名</div> 
          <div className={styles.vr}></div> 
          <input ref={'nickname'} type="text" name="name" placeholder="请输入您的姓名" defaultValue={userInfo.nickname} />
        </div> 
        <div className={styles.row + ' ' + styles.company}>
          <div className={styles.label}>公司</div> 
          <div className={styles.vr}></div> 
          <input ref={'company'} type="text" name="company" placeholder="请输入您的公司（选填）" defaultValue={userInfo.company} />
        </div> 
        <div className={styles.row + ' ' + styles.position}>
          <div className={styles.label}>职位</div> 
          <div className={styles.vr}></div> 
          <input ref={'title'} type="text" name="position" placeholder="请输入您的职位（选填）" defaultValue={userInfo.title}/>
        </div> 
        <div className={styles.confirm} onClick={this.onSubmit.bind(this)}>确认修改</div>
      </div>
    );
  }
}

Modify.propTypes = {
};

const mapStateToProps = (state) => {
  return { common: state.common };
}

export default connect(mapStateToProps)(withRouter(Modify));
