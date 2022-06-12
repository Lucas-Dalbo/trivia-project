import { SETTINGS } from "../actions";

const INITIAL_STATE = {
  numbQuestions: '5',
  cateQuestions: 'all',
  difQuestions: 'all',
  typeQuestions: 'all',
};

const settings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETTINGS:
      return {
        ...state,
        ...action.changes,
      };
    default:
      return {
        ...state,
      };
  }
};

export default settings;
