import React from 'react';
import PropTypes from 'prop-types';

export default class Timer extends React.Component {
  constructor() {
    super();

    this.state = {
      timer: 30,
      gameTime: 0,
    };
  }

  componentDidMount() {
    const TIME_OUT = 1000;
    const gameTime = setInterval(this.setTime, TIME_OUT);
    this.setState({
      gameTime,
    });
  }

  componentWillUnmount() {
    const { timer, gameTime } = this.state;
    const { getTime } = this.props;
    clearInterval(gameTime);
    getTime(timer);
  }

  setTime = () => {
    const { timer, gameTime } = this.state;
    const { endQuestion } = this.props;
    if (timer === 0) {
      clearInterval(gameTime);
      endQuestion();
    } else {
      this.setState((previousState) => ({ timer: previousState.timer - 1 }));
    }
  }

  render() {
    const { timer } = this.state;
    return (
      <p className="timer-box">
        {`Timer: ${timer}`}
      </p>
    );
  }
}

Timer.propTypes = {
  endQuestion: PropTypes.func.isRequired,
  getTime: PropTypes.func.isRequired,
};
