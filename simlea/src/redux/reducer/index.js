/* eslint-disable prettier/prettier */
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import eventReducer from './eventReducer';
import employeeReducer from './employeeReducer';
import formReducer from './formReducer';
import appComponentReducer from './appComponentReducer';
const rootReducer = combineReducers({
  authState: authReducer,
  eventState: eventReducer,
  employeeState: employeeReducer,
  appComponentReducer: appComponentReducer,
  formReducer: formReducer,
});

export default rootReducer;
