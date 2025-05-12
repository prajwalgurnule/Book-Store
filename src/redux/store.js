import { createStore, applyMiddleware } from 'redux';
import bookStoreReducer from './reducer';
import { saveStateMiddleware } from './reducer';

const store = createStore(
  bookStoreReducer,
  applyMiddleware(saveStateMiddleware)
);

export default store;