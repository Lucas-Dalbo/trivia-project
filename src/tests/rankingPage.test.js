import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import localStorageMock from './helpers/mockLocalStorage';

const ranking = [
  {
    playerName: 'teste',
    playerScore: 100,
    playerEmail: 'teste@teste.com',
  },
  {
    playerName: 'teste 2',
    playerScore: 250,
    playerEmail: 'segundteste@teste.com',
  },
];

// Referência de mock manual de localStorage;
// https://thewebdev.info/2022/02/24/how-to-mock-local-storage-in-jest-tests/
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

beforeEach(() => {
  localStorageMock.setItem('ranking', JSON.stringify(ranking));
});

afterEach(() => {
  localStorageMock.clear();
});

describe('tests Ranking component', () => {
  it('should render the ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');
    const rankTitle = screen.getByRole('heading', {
      name: /ranking/i,
      level: 2,
    });
    expect(rankTitle).toBeDefined();

    const rankImg = screen.getAllByRole('img');
    expect(rankImg[1]).toHaveAttribute('alt', 'teste 2');
    expect(rankImg[2]).toHaveAttribute('alt', 'teste');

    const name1 = screen.getByText('teste 2');
    expect(name1).toBeDefined();

    const name2 = screen.getByText('teste');
    expect(name2).toBeDefined();

    const score1 = screen.getByText('250');
    expect(score1).toBeDefined();

    const score2 = screen.getByText('100');
    expect(score2).toBeDefined();
  });

  it('should render button "Back to Start" that works', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');

    const backBtn = screen.getByRole('button', {
      name: 'Back to Start',
    });
    expect(backBtn).toBeDefined();

    userEvent.click(backBtn);
    expect(history.location.pathname).toBe('/');
  });
});
