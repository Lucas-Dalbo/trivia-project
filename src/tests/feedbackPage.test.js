import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import localStorageMock from './helpers/mockLocalStorage';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { MOCK_STATE, MOCK_STATE_FAIL } from './helpers/mockStates';

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('tests Feedback component', () => {
  it('should render the header component', () => {
    renderWithRouterAndRedux(<App />, MOCK_STATE, '/feedback');
    const userImg = screen.getByRole('img', { name: /teste/i });
    expect(userImg).toBeDefined();

    const userName = screen.getByText(/teste/i);
    expect(userName).toBeDefined();

    const userScore = screen.getAllByText('30');
    expect(userScore[0]).toBeDefined();
  });

  it('should render the body text', () => {
    renderWithRouterAndRedux(<App />, MOCK_STATE, '/feedback');
    const title = screen.getByRole('heading', {
      name: /resultados/i,
    });
    expect(title).toBeDefined();

    const feedbackMessage = screen.getByText('Well Done!');
    expect(feedbackMessage).toBeDefined();

    const userAssert = screen.getByText('3');
    expect(userAssert).toBeDefined();

    const userScore = screen.getAllByText('30');
    expect(userScore[1]).toBeDefined();
  });

  it('button "Play Again" should work', () => {
    const { history } = renderWithRouterAndRedux(<App />, MOCK_STATE, '/feedback');

    const btnPlayAgain = screen.getByRole('button', {
      name: /play again/i,
    });
    expect(btnPlayAgain).toBeDefined();

    expect(history.location.pathname).toBe('/feedback');

    userEvent.click(btnPlayAgain);
    expect(history.location.pathname).toBe('/');
  });

  it('button "Ranking" should work', () => {
    const { history } = renderWithRouterAndRedux(<App />, MOCK_STATE, '/feedback');

    const btnRanking = screen.getByRole('button', {
      name: /ranking/i,
    });
    expect(btnRanking).toBeDefined();

    expect(history.location.pathname).toBe('/feedback');

    userEvent.click(btnRanking);
    expect(history.location.pathname).toBe('/ranking');
  });

  it('should render "Could be better" message', () => {
    renderWithRouterAndRedux(<App />, MOCK_STATE_FAIL, '/feedback');

    const feedbackMessage = screen.getByText('Could be better...');
    expect(feedbackMessage).toBeDefined();
  });
});
