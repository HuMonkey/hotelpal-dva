import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

import hongbaoPng from '../../assets/hongbao.png';

class Hongbao extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  open () {
    const { hongbao, dispatch } = this.props;
    const { detail } = hongbao;
    dispatch({
      type: 'hongbao/openRedPacket',
      payload: {
        data: {
          nonce: hongbao.nonce
        }
      },
      onResult (res) {
        console.log(res);
      }
    })
  }

  render () {
    const { hongbao } = this.props;

    const { detail } = hongbao;

    if (!detail) {
      return <div></div>
    }

    const overClass = detail.redPacketRemained === 0 ? ' ' + styles.over : '';

    return (
      <div className={styles.normal}>
        {
          detail.redPacketRemained !== 0 && <div>
            <div className={styles.aavater}>
              <div className={styles.img} style={{ backgroundImage: `url(${detail.userHeadImg})` }}></div>
            </div>
            <div className={styles.name}>{ detail.userName + '请你学知识' }</div>
          </div>
        }
        {
          detail.redPacketRemained === 0 && <div className={styles.overTips}>
            知识红包已抢完，<span><Link to={'/'}>还有知识干货等着你</Link></span><div className={styles.icon}></div>    
          </div>
        }
        <div className={styles.hr}></div>
        <div className={styles.hongbao}>
          <img className={styles.hongbaoBg} src={hongbaoPng} />
          <div className={styles.box}>
            <div className={styles.avater} style={{ backgroundImage: `url(${detail.speakerHeadImg})` }}></div>
            <div className={styles.desc}>
              <div className={styles.title}>{ detail.lessonTitle }</div>
              <div className={styles.who}>{ detail.speakerName }<br />{ detail.speakerCompany + ' ' + detail.speakerTitle }</div>
            </div>
          </div>
          <div className={styles.btn + overClass} onClick={this.open.bind(this)}>{ detail.redPacketRemained > 0 ? '抢' : '抢完了' }</div>
          { detail.redPacketRemained > 0 && <div className={styles.tips}>限量{ detail.redPacketRemained }个名额，快来领取</div> }
          { detail.redPacketRemained === 0 && <div className={styles.tips}>名额已抢完</div> }
        </div>
      </div>
    );
  }
}

Hongbao.propTypes = {
};

const mapStateToProps = (state) => {
  return { hongbao: state.hongbao };
}

export default connect(mapStateToProps)(Hongbao);
