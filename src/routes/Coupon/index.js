import React, {Component} from 'react';
import { connect } from 'dva';
import styles from './index.less';

class Coupon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.normal}>
        coupon
      </div>
    );
  }
}

Coupon.propTypes = {
};

export default connect()(Coupon);
