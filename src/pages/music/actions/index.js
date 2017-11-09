import * as actionTypes from '../consts/actionTypes';

export const searchSong = () => (dispatch) => {
  const myPlayList = [];
  dispatch({
    type: actionTypes.SEARCH_SONG,
    payload: myPlayList
  });
};
