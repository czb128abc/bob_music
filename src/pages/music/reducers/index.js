import { fromJS } from 'immutable';
import * as actionTypes from '../consts/actionTypes';

function createReducer(initialState, handlers) {
  if (!initialState || !handlers) {
    throw new Error('must pass args of "initialState" and "handlers" to createReducer!');
  }

  return (state = initialState, action) => {
    if (action && action.type) {
      const type = action.type;

      if (!handlers[type]) {
        return state;
      }

      return handlers[type](state, action);
    }

    return state;
  };
}


const initialState = fromJS({
  myPlayList: [],
  searchResult: {},
});

const handlers = {
  [actionTypes.SEARCH_SONG](state, { payload }) {
    const { source, list } = payload;
    return state.setIn(`searchResult.${source}`.split('.'), fromJS({ list, source }));
  },
  [actionTypes.ADD_TO_MY_PLAY_LIST](state, { payload }) {
    const { list } = payload;
    let myPlayList = state.get('myPlayList').toJS();
    const tempList = myPlayList
      .filter(item =>
        !list.some(addObj => (item.id === addObj.id && item.source === addObj.source))
      );
    myPlayList = list.concat(tempList);
    return state.set('myPlayList', fromJS(myPlayList));
  },
  [actionTypes.REMOVE_TO_MY_PLAY_LIST](state, { payload }) {
    const { list } = payload;
    const myPlayList = state.get('myPlayList').toJS();
    const tempList = myPlayList
      .filter(item =>
        !list.some(addObj => (item.id === addObj.id && item.source === addObj.source))
      );
    return state.set('myPlayList', fromJS(tempList));
  }
};

export default createReducer(initialState, handlers);
