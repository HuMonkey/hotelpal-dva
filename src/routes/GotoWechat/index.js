import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import { dispatchWechatShare } from '../../utils';

class GotoWechat extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  async componentDidMount () {
    const { dispatch } = this.props;
    const protocol = location.protocol;
    const dict = {
      title: '酒店邦成长营',
      link: protocol + '//' + location.hostname,
      imgUrl: protocol + '//hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    dispatchWechatShare(dict, dispatch);
  }

  render () {
    return (
      <div className={styles.normal}>
        请到微信上酒店邦成长营
      </div>
    );
  }
}

GotoWechat.propTypes = {
};

export default connect()(GotoWechat);
