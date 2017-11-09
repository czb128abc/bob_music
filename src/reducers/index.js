import { combineReducers } from 'redux';
import query from 'react-hoc-query/lib/reducers';
import music from '../pages/music/reducers';

export default combineReducers({
  music,
  query,
});
