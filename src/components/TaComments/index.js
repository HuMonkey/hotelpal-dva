import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import moment from 'moment';
import { Icon } from 'antd';
import { getHtmlContent } from '../../utils';

import arrowPng from '../../assets/live-close-arrow.svg';

class TaComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  switchTa () {
    const { open } = this.state;
    this.setState({
      open: !open,
    })
  }

  render() {
    
    const { open } = this.state;
    const comments = this.props.comments;

    const taClass = open ? ' ' + styles.open : '';

    const taComments = open ? comments.slice(0) : comments.slice(0, 1);
    const taDom = taComments.map((d, i) => {
      let hasPic = false;
      const pubTime = moment(d.updateTime).format('YYYY-MM-DD hh:mm:ss');

      let hasPicClass = '', pic;

      const msg = d.msg || '';
      const reg = new RegExp(/<img[^>]*>/g, "g");
      const img = msg.match(reg);
      if (img && !open) {
        const objE = document.createElement('div');
    　　 objE.innerHTML = img;
    　　 const imgDom = objE.childNodes[0];

        hasPicClass = ' ' + styles.hasPic;
        hasPic = true;
        pic = imgDom.src;
      }

      function createMarkup() { 
        const msg = open ? d.msg || '' : getHtmlContent(d.msg || '');
        if (!msg || hasPic) {
          return { __html: '[图片]' }
        }
        return { __html: msg }; 
      };

      return <div key={i} className={styles.item}>
        <div className={styles.left}>
          <div className={styles.title}>
            <div className={styles.name}>
              <div className={styles.icon}></div>
              { open && <div className={styles.text}>助教</div>}
              { !open && <div className={styles.text}>助教：<span dangerouslySetInnerHTML={createMarkup()}></span></div>}
            </div>  
            { open && <div className={styles.time}>{pubTime}</div>}
          </div>  
          { open && <div className={styles.comment} dangerouslySetInnerHTML={createMarkup()}></div>}
        </div>
        {/* { hasPic && <div className={styles.right} style={{ backgroundImage: `url(${pic})` }}></div> } */}
      </div>
    });

    return (
      <div className={styles.TaComments + taClass}>
        <div>
          {taDom}
        </div>
        <div className={styles.more} onClick={() => this.switchTa.call(this)}>
          { open && <div className={styles.closeBtn}><img src={arrowPng} /></div> }
          { !open && <Icon type="down" /> }
        </div>
      </div>
    )
  }
}

export default TaComments;
