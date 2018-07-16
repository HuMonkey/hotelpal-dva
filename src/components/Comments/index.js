import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

import headerPng from '../../assets/header.png';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { chats } = this.props;

    const comments = chats.sort((a, b) => {
      return a.updateTime - b.updateTime;
    });
    const commentsDom = comments.map((d, i) => {
      const isMineClass = d.self === 'Y' ? ' ' + styles.mine : '';
      // const name = `${d.user.nick} ${d.user.company || ''} ${d.user.title || ''}`;

      function createMarkup() { return { __html: (d.user.nick + '：' + d.msg + d.msg + d.msg) || '' }; };

      return <div className={styles.item + isMineClass} key={i}>
        <div className={styles.avatar} style={{ backgroundImage: `url(${d.user.headImg || headerPng})` }}></div>
        <div className={styles.main}>
          {/* <div className={styles.name}>{name}</div> */}
          <div className={styles.talk}>
            <div className={styles.inner} dangerouslySetInnerHTML={createMarkup()}></div>
            <div className={styles.arrow}></div>
          </div>
        </div>
      </div>
    })

    return (
      <div className={styles.comments}>
        {commentsDom}
      </div>
    )
  }
}

export default Comments;
