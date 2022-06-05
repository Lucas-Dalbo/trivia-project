import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, resetState } from '../redux/actions';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      isDisable: true,
    };
  }

  componentDidMount() {
    const { clearState } = this.props;
    clearState();
  }

  handleButton = () => {
    const { name, email } = this.state;
    let btnLock = true;
    if (name.length > 0 && email.length > 0) btnLock = false;
    this.setState({
      isDisable: btnLock,
    });
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, () => this.handleButton());
  }

  startBtnClick = async (e) => {
    e.preventDefault();
    const { history, makeLogin } = this.props;
    const { name, email } = this.state;
    try {
      const result = await fetch('https://opentdb.com/api_token.php?command=request');
      const token = await result.json();
      localStorage.setItem('token', token.token);
      makeLogin({ name, email });
      history.push('/game');
    } catch (erro) {
      console.log(erro);
    }
  }

  render() {
    const { name, email, isDisable } = this.state;
    const { history } = this.props;
    return (
      <div className="login-box">
        <button
          type="button"
          name="settings"
          className="sett-btn"
          data-testid="btn-settings"
          onClick={ () => history.push('/settings') }
        >
          ⚙ Settings
        </button>
        <form className="login-form">
          <label htmlFor="name">
            Nome
            <input
              type="text"
              id="name"
              name="name"
              value={ name }
              onChange={ this.handleChange }
              data-testid="input-player-name"
            />
          </label>
          <label htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              name="email"
              value={ email }
              onChange={ this.handleChange }
              data-testid="input-gravatar-email"
            />
          </label>
          <button
            type="submit"
            data-testid="btn-play"
            disabled={ isDisable }
            onClick={ this.startBtnClick }
          >
            Play
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  makeLogin: (payload) => dispatch(loginUser(payload)),
  clearState: () => dispatch(resetState()),
});

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  makeLogin: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
