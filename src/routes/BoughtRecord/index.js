import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import { configWechat, updateWechartShare } from '../../utils/';

class BoughtRecord extends Component {
  constructor(props) {
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
    const { bought } = this.props;
    if (!bought) {
      return <div></div>
    }
  
    const { boughtList } = bought;
  
    return (
      <div className={styles.normal}>
        {
          boughtList.map((d, i) => {
            return <Link key={i} to={`/course/${d.id}`}>
              <div className={styles.item}>
                <div className={styles.avater} style={ {backgroundImage: `url('${d.headImg}')` }}></div> 
                <div className={styles.desc}>
                  <div className={styles.title}>{d.title}</div> 
                  <div className={styles.orderid}>订单号：{d.tradeNo}</div> 
                  <div className={styles.time}>购买时间：{d.purchaseDate}</div> 
                  <div className={styles.price}>
                    实付：¥ {d.payment / 100} 
                    { d.originalCharge && d.originalCharge != d.payment && <span>（优惠：¥ {(d.originalCharge - d.payment) / 100}）</span> }
                  </div>
                </div>
              </div>
            </Link>
          })
        }
      </div>
    );
  }
}

BoughtRecord.propTypes = {
};

const mapStateToProps = (state) => {
  return { bought: state.bought };
}

export default connect(mapStateToProps)(BoughtRecord);
