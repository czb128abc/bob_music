import { createStore, applyMiddleware, compose } from 'redux';
import rootReducers from './reducers';

let enhancer = applyMiddleware();
// console error in development environment
enhancer = compose(
  enhancer,
  window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default createStore(rootReducers, enhancer);
