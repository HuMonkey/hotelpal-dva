import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import { dispatchWechatShare } from '../../utils/';
import { Navs } from '../../components';

class BoughtRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render () {
    const { bought } = this.props;
    if (!bought || !bought.boughtList) {
      return <div></div>
    }
  
    const boughtList = bought.boughtList.sort((a, b) => {
      return new Date(b.purchaseDate) > new Date(a.purchaseDate);
    });
  
    return (
      <div className={styles.normal}>
        <Navs />
        {
          boughtList && boughtList.map((d, i) => {
            return <Link key={i} to={`/course/${d.id}`}>
              <div className={styles.item}>
                <div className={styles.avater} style={ {backgroundImage: `url('${d.headImg}')` }}></div> 
                <div className={styles.desc}>
                  <div className={styles.title}>{d.title}</div> 
                  <div className={styles.orderid}>订单号：{d.tradeNo}</div> 
                  <div className={styles.time}>购买时间：{d.purchaseDate}</div> 
                  <div className={styles.price}>
                    实付：¥ {d.payment / 100} 
                    { d.originalCharge && d.originalCharge != d.payment ? <span>（优惠：¥ {(d.originalCharge - d.payment) / 100}）</span> : <span></span> }
                  </div>
                </div>
              </div>
            </Link>
          })
        }
        {
          (boughtList && boughtList.length === 0) && <div className={styles.nothing}>
            <div className={styles.shoppingCar}></div>
              <p>你还没有购买课程</p>
              <Link to={`/`}><div className={styles.buy}>
                <div className={styles.magnifier}></div>
                发现课程
              </div></Link>
            </div>
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
