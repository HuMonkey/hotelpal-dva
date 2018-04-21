import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

function BoughtRecord({ bought }) {
  if (!bought) {
    return <div></div>
  }

  const { boughtList } = bought;
  console.log(boughtList);

  return (
    <div className={styles.normal}>
      {
        [1, 1, 1, 1, 1, 1, 1, 1, 1].map((d, i) => {
          return <div key={i} className={styles.item}>
            <div className={styles.avater} style={ {backgroundImage: `url('http://img.hotelpal.cn/1503391961043.jpg')` }}></div> 
            <div className={styles.desc}>
              <div className={styles.title}>服务创新设计课</div> 
              <div className={styles.orderid}>订单号：f201709192051300037</div> 
              <div className={styles.time}>购买时间：2017-09-19</div> 
              <div className={styles.price}>实付：¥ 0 <span>（优惠：¥ 99）</span></div>
            </div>
          </div>
        })
      }
    </div>
  );
}

BoughtRecord.propTypes = {
};

const mapStateToProps = (state) => {
  return { bought: state.bought };
}

export default connect()(BoughtRecord);
