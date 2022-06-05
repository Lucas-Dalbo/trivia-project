import React from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';
// import { connect } from 'react-redux';

class Ranking extends React.Component {
  constructor() {
    super();
    this.state = {
      ranking: [],
    };
  }

  componentDidMount() {
    this.setRanking();
  }

  findGravatarImg = (email) => {
    const hash = md5(email).toString();
    return `https://www.gravatar.com/avatar/${hash}`;
  }

  setRanking = () => {
    const data = localStorage.getItem('ranking');
    const ranking = JSON.parse(data);
    const sortRank = ranking.sort((a, b) => b.playerScore - a.playerScore);
    this.setState({
      ranking: sortRank,
    });
  }

  render() {
    const { history } = this.props;
    const { ranking } = this.state;
    return (
      <div className="ranking-box">
        <h2
          data-testid="ranking-title"
          className="ranking-title"
        >
          Ranking
        </h2>
        <div className="ranking">
          {
            ranking.map((player, index) => (
              <div key={ index } className="player-card">
                <img
                  src={ this.findGravatarImg(player.playerEmail) }
                  alt={ player.playerName }
                />
                <p data-testid={ `player-name-${index}` }>{ player.playerName }</p>
                <p data-testid={ `player-score-${index}` }>{ player.playerScore }</p>
              </div>
            ))
          }
        </div>
        <button
          type="button"
          className="back-btn"
          data-testid="btn-go-home"
          onClick={ () => history.push('/') }
        >
          Back to Start
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Ranking;
