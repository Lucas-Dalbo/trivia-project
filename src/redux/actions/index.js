export const LOGIN = 'LOGIN';
export const SCORE = 'SCORE';
export const RESET = 'RESET';

export const loginUser = (payload) => ({
  type: LOGIN,
  payload,
});

export const setScore = (score) => ({
  type: SCORE,
  score,
});

export const resetState = () => ({
  type: RESET,
});

// Settings action
export const SETTINGS = 'SETTINGS';

export const changeSettings = (changes) => ({
  type: SETTINGS,
  changes,
});
