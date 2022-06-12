import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeSettings } from '../redux/actions';


class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      load: false,
      categories: [],
      err: null,
      saved: false,
      numbQuestions: '5',
      cateQuestions: 'all',
      difQuestions: 'all',
      typeQuestions: 'all',
    }
  }
  
  componentDidMount() {
    this.fetchCategories();
    this.fetchOldSet();
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  }

  fetchOldSet = () => {
    const { oldSet } =this.props;
    this.setState({
      ...oldSet,
    })
  }
  
  fetchCategories = () => {
    this.setState({ load: true }, async () => {
      try {
        const result = await fetch('https://opentdb.com/api_category.php');
        const categories = await result.json();
        this.setState({
          load: false,
          categories: categories.trivia_categories,
        });
      } catch (error) {
        this.setState({
          laod: false,
          err: true,
        });
      }
    });
  }

  saveNewSet = (e) => {
    e.preventDefault();
    const { saveSetttings } = this.props;
    const { difQuestions, cateQuestions,
      numbQuestions, typeQuestions  } = this.state;
    
    saveSetttings({ difQuestions, cateQuestions,
      numbQuestions, typeQuestions });
    
    this.setState({ saved: true });
  }

  render() {
    const { history } = this.props;
    const { difQuestions, cateQuestions,
      numbQuestions, typeQuestions,
      err, categories, saved, load } = this.state;
    return (
      <div>
        <header className="settings-header">
          <h2 data-testid="settings-title">Settings</h2>
          { err && <p>An error occurred... Please reload the page</p> }
          { saved && <p>Settings saved!</p> }
        </header>
        <form
          onSubmit={ (e) => e.preventDefault }
          className="settings-form"
        >
          <label>
            Number of Questions:
            <select
              name="numbQuestions"
              value={ numbQuestions }
              onChange={ this.handleChange }
            >
              <option value="5" >5</option>
              <option value="10" >10</option>
              <option value="15" >15</option>
            </select>
          </label>
          <label>
            Category:
            <select
              name="cateQuestions"
              value={ cateQuestions }
              onChange={ this.handleChange }
            >
              <option value="all" >All</option>
              {
                categories.map((cat) => (
                  <option key={ cat.id } value={ cat.id } >{ cat.name }</option>
                ))
              }
            </select>
          </label>
          <label>
            Difficulty:
            <select
              name="difQuestions"
              value={ difQuestions }
              onChange={ this.handleChange }
            >
              <option value="all" >All</option>
              <option value="easy" >Easy</option>
              <option value="medium" >Medium</option>
              <option value="hard" >Hard</option>
            </select>
          </label>
          <label>
            Question Type:
            <select
              name="typeQuestions"
              value={ typeQuestions }
              onChange={ this.handleChange }
            >
              <option value="all" >All</option>
              <option value="multiple" >Multiple Choice</option>
              <option value="boolean" >True or False</option>
            </select>
            <button
              type="submit"
              name="save-settings"
              className="save-btn"
              onClick={ this.saveNewSet }
              disable={ err || load ? true : false }
            >
              Save Settings
            </button>
          </label>
        </form>
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

const mapStateToProps = (state) => ({
  oldSet: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
  saveSetttings: (newSet) => dispatch(changeSettings(newSet)),
});

Settings.propTypes = {
  oldSet: PropTypes.objectOf(PropTypes.string).isRequired,
  saveSetttings: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
