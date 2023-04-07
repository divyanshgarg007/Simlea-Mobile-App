/* eslint-disable prettier/prettier */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const appReducers = combineReducers({
  rootReducers: persistReducer(persistConfig, rootReducer),
});

const parentReducer = (state, action) => appReducers(state, action);
const logger = createLogger();

export const store = createStore(parentReducer, applyMiddleware(thunk, logger));
export const persistor = persistStore(store);
