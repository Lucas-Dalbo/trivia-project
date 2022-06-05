import React from 'react';

class Settings extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <div>
        <header>
          <h2 data-testid="settings-title">Settings</h2>
          <p>Still is progress...</p>
        </header>
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

export default Settings;
