import React, {Component} from 'react';
import styles from './index.less';

class Wave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  componentDidMount() {
    // preload
    for (let i = 1; i < 200; i++) {
      let number = i;
      if (number < 100) {
        number = '0' + number;
      }
      if (number < 10) {
        number = '0' + number;
      }
      new Image().src = `//static.hotelpal.cn/wav/${number}.png`;
    }
    setInterval(() => {
      let index = ++this.state.index;
      if (index > 199) {
        index = 0;
      }
      this.setState({
        index,
      })
    }, 50)
  }

  render() {
    const { index } = this.state;
    let number = index;
    if (number < 100) {
      number = '0' + number;
    }
    if (number < 10) {
      number = '0' + number;
    }
    return (
      <div className={styles.wave}>
        <img src={`//static.hotelpal.cn/wav/${number}.png`} />
      </div>
    )
  }
}

export default Wave;
