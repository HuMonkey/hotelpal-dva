import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

function BoughtRecord({ bought }) {
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

BoughtRecord.propTypes = {
};

const mapStateToProps = (state) => {
  return { bought: state.bought };
}

export default connect(mapStateToProps)(BoughtRecord);
