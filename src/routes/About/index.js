import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

import logo from '../../assets/jiudianbang-big.png';
import kefu from '../../assets/kefu.jpg';
import {dispatchWechatShare} from '../../utils';
import { Navs } from '../../components';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erweimaShow: false,
    };
  }

  async componentDidMount () {
    const { dispatch } = this.props;
    const dict = {
      title: '酒店邦成长营',
      link: location.protocol + '//' + location.hostname,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    dispatchWechatShare(dict, dispatch);
  }

  showErweima () {
    this.setState({
      erweimaShow: true,
    })
  }

  hideErweima () {
    this.setState({
      erweimaShow: false,
    })
  }

  render() {
    return (
      <div className={styles.normal}>
        <Navs/>
        <div className={styles.logo}>
          <div className={styles.version}>2.0</div> 
          <img src={logo} />
        </div> 
        <div className={styles.slogon}>酒店邦成长营 与你一起成长</div> 
        <div className={styles.desc}>
          酒店邦成长营，为你提供高效、有价值的行业知识服务，帮助你拓宽认知思维与提升实战能力，以取得更好的职业发展。
          <div></div>
          我们提倡酒店行业人成为终生学习者，酒店邦成长营愿与你一起成长。
        </div> 
        <div className={styles.item + ' ' + styles.contact} onClick={this.showErweima.bind(this)}>
          联系客服
          <div className={styles.erweima}></div> 
          <div className={styles.arrowRight}></div>
        </div> 
        <div className={styles.item + ' ' + styles.coorperating}>
          商务合作
          <span>3529653959@qq.com</span>
        </div>
        { 
          this.state.erweimaShow && <div className={styles.erweimaWindow}>
            <div className={styles.cover}></div> 
            <div className={styles.box}>
              <div className={styles.title}>
                <div className={styles.text}>为你服务</div> 
                <div className={styles.time}>[ 工作日 10:00 - 18:00 ]</div>
              </div> 
              <div className={styles.main}>
                <div className={styles.erweima}>
                  <img src={kefu} />
                </div> 
                <div className={styles.tips}>长按二维码联系客服</div>
              </div>
            </div> 
            <div className={styles.close} onClick={this.hideErweima.bind(this)}></div>
          </div> 
        }
      </div>
    );
  }
}

About.propTypes = {
};

export default connect()(About);
