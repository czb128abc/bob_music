import * as actionTypes from '../consts/actionTypes';
import musicApi from '../services';

export const searchSong = keywords => (dispatch) => {
  musicApi.netease.search(keywords).then((data) => {
    dispatch({
      type: actionTypes.SEARCH_SONG,
      payload: { list: data.list, source: musicApi.netease.source }
    });
  });
  musicApi.qq.search(keywords).then((data) => {
    dispatch({
      type: actionTypes.SEARCH_SONG,
      payload: { list: data.list, source: musicApi.qq.source }
    });
  });
  musicApi.xiami.search(keywords).then((data) => {
    dispatch({
      type: actionTypes.SEARCH_SONG,
      payload: { list: data.list, source: musicApi.xiami.source }
    });
  });
};

export const addToMyPlayList = list => ({
  type: actionTypes.ADD_TO_MY_PLAY_LIST,
  payload: { list }
});

export const removeToMyPlayList = list => ({
  type: actionTypes.REMOVE_TO_MY_PLAY_LIST,
  payload: { list }
});
