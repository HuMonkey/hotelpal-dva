import React, {Component} from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

class IntroPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, html } = this.props;

    const createMarkup = function() {
      return { __html: html || '暂无' };
    }

    return (
      <div className={styles.introPanel}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content} dangerouslySetInnerHTML={createMarkup()}></div>
      </div>
    )
  }
}

export default IntroPanel;
