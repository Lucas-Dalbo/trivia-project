import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';

const NAME = 'input-player-name';
const EMAIL = 'input-gravatar-email';

describe('tests Login component', () => {
  it('should render proper pathname', () => {
    const { history: { location } } = renderWithRouterAndRedux(<App />);

    expect(location.pathname).toBe('/');
  });

  it('should render the settings button', () => {
    renderWithRouterAndRedux(<App />);

    const settingsButton = screen.getByRole('button', { name: '⚙' });

    expect(settingsButton).toBeDefined();
  });

  it('should render proper label texts', () => {
    renderWithRouterAndRedux(<App />);

    const labelName = screen.getByLabelText('Nome');
    const labelEmail = screen.getByLabelText('Email');

    expect(labelName).toBeDefined();
    expect(labelEmail).toBeDefined();
  });

  it('should render both inputs correctly', () => {
    renderWithRouterAndRedux(<App />);

    const nameInput = screen.getByTestId(NAME);
    const emailInput = screen.getByTestId(EMAIL);

    expect(nameInput).toBeDefined();
    expect(emailInput).toBeDefined();
  });

  it('should render play button', () => {
    renderWithRouterAndRedux(<App />);

    const playButton = screen.getByRole('button', { name: 'Play' });

    expect(playButton).toBeDefined();
  });

  it('play button is disabled initially, but enabled when user texts on both inputs',
    () => {
      renderWithRouterAndRedux(<App />);

      const nameInput = screen.getByTestId(NAME);
      const emailInput = screen.getByTestId(EMAIL);
      const playButton = screen.getByRole('button', { name: 'Play' });

      expect(playButton).toBeDisabled();

      userEvent.type(nameInput, 'testing name');
      userEvent.type(emailInput, 'testing email');

      expect(playButton).not.toBeDisabled();
    });

  it('tests page changing after user clicks on settings button', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const settingsButton = screen.getByRole('button', { name: '⚙' });

    expect(history.location.pathname).toBe('/');
    userEvent.click(settingsButton);
    expect(history.location.pathname).toBe('/settings');
  });

  it('tests page changing after user clicks on play button', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const nameInput = screen.getByTestId(NAME);
    const emailInput = screen.getByTestId(EMAIL);
    const playButton = screen.getByRole('button', { name: 'Play' });

    expect(history.location.pathname).toBe('/');
    userEvent.type(nameInput, 'testing name');
    userEvent.type(emailInput, 'testing email');

    userEvent.click(playButton);
    const TIME = 2000;
    await new Promise((r) => setTimeout(r, TIME));
    expect(history.location.pathname).toBe('/game');
  });
});
