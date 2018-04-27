import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import chahua from '../../assets/chahua1.png';
import gzh from '../../assets/gongzhonghao.jpg';

import { configWechat, updateWechartShare } from '../../utils';

class WeChat extends Component {
  constructor (props) {
    super(props);
    this.state = {};
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
    return (
      <div className={styles.normal}>
        <img src={chahua} className={styles.chahua1} /> 
        <div className={styles.thing}>
          <img src={gzh} className={styles.erweima} /> 
          <div className={styles.tips}>长按二维码</div> 
          <div className={styles.tips}>关注微信公众号</div>
        </div>
      </div>
    );
  }
}

WeChat.propTypes = {
};

export default connect()(WeChat);
