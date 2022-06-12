import { combineReducers } from 'redux';
import player from './reducer';
import settings from './settings';

const rootReducer = combineReducers({
  player,
  settings,
});

export default rootReducer;
