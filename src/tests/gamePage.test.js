import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import localStorageMock from './helpers/mockLocalStorage';
import mockToken, { mockResult } from './helpers/mockAPI';
import { MOCK_STATE_FAIL } from './helpers/mockStates';

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

beforeEach(() => {
  localStorageMock.setItem('token', mockToken);
  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockResult),
  });
});

describe('tests Game page', () => {
  it('shoud fetch questions', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    expect(global.fetch).toBeCalled();
    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toBeCalledWith(`https://opentdb.com/api.php?amount=5&token=${mockToken}`);
  });

  it('should show loading', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const loadText = screen.getByText('Loading...');
    expect(loadText).toBeDefined();
  });

  it('should render answer buttons', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');

    const answers01 = await screen.findByRole('button', { name: 'Apollo' });
    const answers02 = await screen.findByRole('button', { name: 'Hermes' });
    const answers03 = await screen.findByRole('button', { name: 'Poseidon' });
    const answers04 = await screen.findByRole('button', { name: 'Zeus' });

    expect(answers01).toBeDefined();
    expect(answers02).toBeDefined();
    expect(answers03).toBeDefined();
    expect(answers04).toBeDefined();
  });

  it('should render answer randomly', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');

    const answers = await screen.findAllByRole('button');
    expect(answers[3]).not.toHaveValue('Zeus');
  });

  it('should render "Next Button" after clicking an answer', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');

    const answers = await screen.findAllByRole('button');
    expect(answers[0]).toBeDefined();

    userEvent.click(answers[0]);

    expect(answers[0]).toHaveAttribute('disabled');
    expect(answers[1]).toHaveAttribute('disabled');
    expect(answers[2]).toHaveAttribute('disabled');
    expect(answers[3]).toHaveAttribute('disabled');

    const btnNext = await screen.findByRole('button', { name: 'Next' });
    expect(btnNext).toBeDefined();
  });

  it('should render questions', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const firtsQuestion = 'Who was the King of Gods in Ancient Greek mythology?';
    const firtsQ = await screen.findByText(firtsQuestion);
    expect(firtsQ).toBeDefined();

    const firstQType = screen.findByText('Mythology');
    expect(firstQType).toBeDefined();
  });

  it('should render the next question', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');
    const answers = await screen.findAllByRole('button');
    userEvent.click(answers[0]);
    const btnNext = await screen.findByRole('button', { name: 'Next' });
    userEvent.click(btnNext);

    const quest = 'What did the Spanish autonomous community of Catalonia ban in 2010?';
    const secondQ = await screen.findByText(quest);
    expect(secondQ).toBeDefined();
  });

  it('should increment score', async () => {
    const { history } = renderWithRouterAndRedux(<App />, MOCK_STATE_FAIL);
    history.push('/game');
    const scoreInitial = await screen.findByText('0');
    expect(scoreInitial).toBeDefined();
    const answers04 = await screen.findByRole('button', { name: 'Zeus' });
    userEvent.click(answers04);
    const scoreAcert = screen.getByText('40');
    expect(scoreAcert).toBeDefined();
  });

  it('should not increment score', async () => {
    const { history } = renderWithRouterAndRedux(<App />, MOCK_STATE_FAIL);
    history.push('/game');
    const scoreInitial = await screen.findByText('0');
    expect(scoreInitial).toBeDefined();
    const answers04 = await screen.findByRole('button', { name: 'Apollo' });
    userEvent.click(answers04);
    const scoreAcert = screen.getByText('0');
    expect(scoreAcert).toBeDefined();
  });

  it('should go to "Feedback" after the last question', async () => {
    const { history } = renderWithRouterAndRedux(<App />, MOCK_STATE_FAIL, '/game');
    const answers1 = await screen.findAllByRole('button');
    userEvent.click(answers1[0]);
    const btnNext1 = await screen.findByRole('button', { name: 'Next' });
    userEvent.click(btnNext1);

    const answers2 = await screen.findAllByRole('button');
    userEvent.click(answers2[0]);
    const btnNext2 = await screen.findByRole('button', { name: 'Next' });
    userEvent.click(btnNext2);

    const answers3 = await screen.findAllByRole('button');
    userEvent.click(answers3[0]);
    const btnNext3 = await screen.findByRole('button', { name: 'Next' });
    userEvent.click(btnNext3);

    const answers4 = await screen.findAllByRole('button');
    userEvent.click(answers4[0]);
    const btnNext4 = await screen.findByRole('button', { name: 'Next' });
    userEvent.click(btnNext4);

    const answers5 = await screen.findAllByRole('button');
    userEvent.click(answers5[0]);
    const btnNext5 = await screen.findByRole('button', { name: 'Next' });
    userEvent.click(btnNext5);

    expect(history.location.pathname).toBe('/feedback');
  });

  it('should return to "Login" if the token in invalid', async () => {
    localStorageMock.setItem('token', mockToken);
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        response_code: 3,
        results: [],
      }),
    });
    const { history } = renderWithRouterAndRedux(<App />, MOCK_STATE_FAIL, '/game');
    expect(history.location.pathname).toBe('/game');

    const nameInput = await screen.findByTestId('input-player-name');
    expect(nameInput).toBeDefined();

    expect(history.location.pathname).toBe('/');
  });

  jest.setTimeout(35000);

  it('should show timer properly', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/game');

    expect(await screen.findByText('Timer: 30')).toBeDefined();
    
    const TWO_SECONDS = 2000;
    await new Promise((r) => setTimeout(r, TWO_SECONDS));
    
    expect(screen.getByText('Timer: 28')).toBeDefined();
    
    const THIRTY_SECONDS = 30000;
    await new Promise((r) => setTimeout(r, THIRTY_SECONDS));

    expect(screen.getByText('0')).toBeDefined();
  });
});
