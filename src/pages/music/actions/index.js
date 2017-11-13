import * as actionTypes from '../consts/actionTypes';
import netease from '../services/netease';

export const searchSong = keywords => (dispatch) => {
  netease.search(keywords).then((data) => {
    dispatch({
      type: actionTypes.SEARCH_SONG,
      payload: { list: data.list, source: netease.source }
    });
  });
};

export const addToMyPlayList = list => ({
  type: actionTypes.ADD_TO_MY_PLAY_LIST,
  payload: { list }
});
