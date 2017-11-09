import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducers from './reducers';

let enhancer = applyMiddleware(thunk);
// console error in development environment
enhancer = compose(
  enhancer,
  window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default createStore(rootReducers, enhancer);
