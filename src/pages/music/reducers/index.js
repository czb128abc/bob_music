import { fromJS } from 'immutable';
// import * as actionTypes from '../consts/actionTypes';

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
  currentPlaying: null,
  playerSettings: {
    playMode: 0,
    volume: 0.8,
    nowPlayingTrackId: null,
  },
  myPlayList: []
});

const handlers = {};

export default createReducer(initialState, handlers);
