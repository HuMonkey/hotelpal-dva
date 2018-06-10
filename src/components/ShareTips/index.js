import React, {Component} from 'react';
import styles from './index.less';

import hongbaoTipsPng from '../../assets/hongbaotips.png';
import shareTipsPng from '../../assets/invite-share.png';
import pointerPng from '../../assets/pointer.png';

class ShareTips extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, clickCallBack } = this.props;

    return (
      <div className={styles.shareTips} onClick={clickCallBack}>
        <div className={styles.cover}></div>
        { 
          type === 'hongbao' && <div>
            <img className={styles.text} src={hongbaoTipsPng} />
            <img className={styles.pointer} src={pointerPng} />
          </div> 
        }
        { 
          type === 'invite' && <div>
            <img className={styles.text} src={shareTipsPng} />
            <img className={styles.pointer} src={pointerPng} />
          </div> 
        }
      </div> 
    )
  }
}

export default ShareTips;
