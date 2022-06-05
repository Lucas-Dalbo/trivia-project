import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import he from 'he';
import Header from '../components/Header';
import Timer from '../components/Timer';
import { setScore } from '../redux/actions';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      questionIndex: 0,
      answers: [],
      loading: true,
      clickAnswer: false,
      allButtonsDisabled: false,
      clickedAnswer: '',
    };
  }

  componentDidMount() {
    this.fetchTrivia();
  }

  fetchTrivia = async () => {
    this.setState({ loading: true }, async () => {
      const token = localStorage.getItem('token');
      const URL = `https://opentdb.com/api.php?amount=5&token=${token}`;

      const response = await fetch(URL);
      const data = await response.json();
      this.tokenValidator(data.response_code);
      this.setState({ questions: data.results }, () => {
        this.setAnswers();
        this.setState({ loading: false });
      });
    });
  }

  tokenValidator = (response) => {
    const { history } = this.props;
    const VALIDATE_NUMBER = 3;

    const invalid = response === VALIDATE_NUMBER;

    if (invalid) {
      localStorage.removeItem('token');
      history.push('/');
    }
  }

  setAnswers = () => {
    const { questions, questionIndex } = this.state;
    const answersNotShuffled = [...questions[questionIndex].incorrect_answers,
      questions[questionIndex].correct_answer];
    // https://flaviocopes.com/how-to-shuffle-array-javascript/
    const answers = answersNotShuffled.sort(() => Math.random() - '0.5');
    this.setState({ answers });
  }

  answerClass = (answer) => {
    const { questions, questionIndex } = this.state;
    if (answer === questions[questionIndex].correct_answer) {
      return 'green-border';
    }
    return 'red-border';
  }

  clickAnswerBtn = ({ target: { value = '' } } = { target: { value: '' } }) => {
    this.setState({
      clickAnswer: true,
      allButtonsDisabled: true,
      clickedAnswer: value });
  }

  nextQuestion = () => {
    const { questionIndex, questions } = this.state;
    const { history } = this.props;
    if (questionIndex < questions.length - 1) {
      this.setState((previous) => ({
        questionIndex: previous.questionIndex + 1,
        clickAnswer: !previous.clickAnswer,
        allButtonsDisabled: !previous.allButtonsDisabled,
      }), () => this.setAnswers());
    } else {
      history.push('/feedback');
    }
  }

  getTime = (timerValue) => {
    this.scoreCalculator(timerValue);
  }

  scoreCalculator = (time) => {
    const { questions, questionIndex, clickedAnswer } = this.state;
    const { sendScore } = this.props;
    const rigthAnswer = questions[questionIndex].correct_answer;
    const { difficulty } = questions[questionIndex];
    const level = {
      easy: 1,
      medium: 2,
      hard: 3,
    };
    if (clickedAnswer === rigthAnswer) {
      const FIXED_POINT = 10;
      const getPoint = FIXED_POINT + (time * level[difficulty]);
      sendScore(getPoint);
    }
  }

  render() {
    const { questions, questionIndex, answers, loading,
      clickAnswer, allButtonsDisabled } = this.state;
    return (
      <div className="game-box">
        <Header />
        { !loading && !clickAnswer
          && <Timer
            getTime={ this.getTime }
            endQuestion={ this.clickAnswerBtn }
          />}
        {loading ? <p>Loading...</p> : (
          <div className="question-box">
            <p data-testid="question-category">{questions[questionIndex].category}</p>
            <p data-testid="question-text">
              {he.decode(questions[questionIndex].question)}
            </p>
            <div data-testid="answer-options" className="answer-box">
              {answers.map((answer, index) => (
                <button
                  data-testid={ answer === questions[questionIndex].correct_answer
                    ? 'correct-answer'
                    : `wrong-answer-${index}` }
                  className={ clickAnswer === false ? 'none' : this.answerClass(answer) }
                  onClick={ this.clickAnswerBtn }
                  key={ answer }
                  type="button"
                  value={ answer }
                  disabled={ allButtonsDisabled }
                >
                  <span className="answer-numb">{index + 1}</span>
                  {he.decode(answer)}
                </button>
              ))}
            </div>
          </div>)}
        {
          clickAnswer && (
            <button
              type="button"
              data-testid="btn-next"
              onClick={ this.nextQuestion }
              className="next-btn"
            >
              Next
            </button>)
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendScore: (score) => dispatch(setScore(score)),
});

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  sendScore: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Game);
