import React from 'react';
import md5 from 'md5';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      hash: '',
    };
  }

  componentDidMount = () => {
    this.findGravatarImg();
  }

  findGravatarImg = () => {
    const { email } = this.props;
    const hash = md5(email).toString();
    this.setState({
      hash,
    });
  }

  render() {
    const { hash } = this.state;
    const { userName, userScore } = this.props;
    const url = `https://www.gravatar.com/avatar/${hash}`;
    return (
      <header className="header-box">
        <img
          src={ url }
          alt={ userName }
          data-testid="header-profile-picture"
        />
        <p data-testid="header-player-name">{ userName }</p>
        <p>
          {'Score: '}
          <span data-testid="header-score">{ userScore }</span>
        </p>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.player.gravatarEmail,
  userName: state.player.name,
  userScore: state.player.score,
});

Header.propTypes = {
  userName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  userScore: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Header);
