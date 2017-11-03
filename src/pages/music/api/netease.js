/* eslint-disable linebreak-style */
import querystring from 'querystring';
import Enc from './crypto';

require('es6-promise').polyfill();
require('isomorphic-fetch');


const NETEASE_API_URL = 'http://music.163.com/weapi';

const NeteaseRequest = (url, query) => {
  const opts = {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      // Origin: 'http://music.163.com',
      // Referer: 'http://music.163.com',
      // 'X-Real-IP': '211.161.244.70',
      Cookie: 'appver=1.5.2',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include'
  };
  opts.body = querystring.stringify(query);
  return new Promise((resolve, reject) => {
    fetch(NETEASE_API_URL + url, opts)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err));
  });
};

/*
 *  查询
 *  type - 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
 */

const searchSong = (key, limit, page, raw) => {
  const obj = {
    s: key,
    type: 1,
    limit,
    offset: (page - 1) * limit
  };
  const encData = Enc.aesRsaEncrypt(JSON.stringify(obj));
  if (!raw) {
    return new Promise((resolve, reject) => {
      NeteaseRequest('/cloudsearch/get/web?csrf_token=', encData)
        .then((res) => {
          let songList;
          if (res.result.songCount === 0) {
            songList = [];
          } else {
            songList = res.result.songs.map(item => ({
              album: {
                id: item.al.id,
                name: item.al.name,
                cover: `${item.al.picUrl.replace('http://', 'https://')}?param=250y250`,
                coverBig: `${item.al.picUrl.replace('http://', 'https://')}?param=400y400`,
                coverSmall: `${item.al.picUrl.replace('http://', 'https://')}?param=140y140`,
              },
              // [{id: , name: }]
              artists: item.ar,
              name: item.name,
              id: item.id,
              needPay: item.fee > 0,
            }));
          }
          const obj1 = {
            success: true,
            total: res.result.songCount,
            songList
          };
          resolve(obj1);
        })
        .catch(err => reject({
          success: false,
          message: err
        }));
    });
  }
  return NeteaseRequest('/cloudsearch/get/web?csrf_token=', encData);
};

const searchPlaylist = (key, limit, page, raw) => {
  const obj = {
    s: key,
    type: 1000,
    limit,
    offset: (page - 1) * limit
  };
  const encData = Enc.aesRsaEncrypt(JSON.stringify(obj));
  if (!raw) {
    return new Promise((resolve, reject) => {
      NeteaseRequest('/cloudsearch/get/web?csrf_token=', encData)
        .then((res) => {
          const playlists = res.result.playlists.map(item => ({
            id: item.id,
            cover: `${item.coverImgUrl.replace('http://', 'https://')}?param=250y250`,
            coverBig: `${item.coverImgUrl.replace('http://', 'https://')}?param=400y400`,
            coverSmall: `${item.coverImgUrl.replace('http://', 'https://')}?param=140y140`,
            name: item.name,
            author: {
              name: item.creator.nickname,
              id: item.creator.userId,
              // @important: no avatar here
              avatar: null
            },
          }));
          const obj1 = {
            success: true,
            total: res.result.playlistCount,
            playlists
          };
          resolve(obj1);
        })
        .catch(err => reject({
          success: false,
          message: err
        }));
    });
  }
  return NeteaseRequest('/cloudsearch/get/web?csrf_token=', encData);
};

const searchAlbum = (key, limit, page, raw) => {
  const obj = {
    s: key,
    type: 10,
    limit,
    offset: (page - 1) * limit
  };
  const encData = Enc.aesRsaEncrypt(JSON.stringify(obj));
  if (!raw) {
    return new Promise((resolve, reject) => {
      NeteaseRequest('/cloudsearch/get/web?csrf_token=', encData)
        .then((res) => {
          const albumList = res.result.albums.map(item => ({
            id: item.id,
            cover: `${item.picUrl.replace('http://', 'https://')}?param=250y250`,
            coverBig: `${item.picUrl.replace('http://', 'https://')}?param=400y400`,
            coverSmall: `${item.picUrl.replace('http://', 'https://')}?param=140y140`,
            name: item.name,
            artist: {
              name: item.artist.name,
              id: item.artist.id
            },
          }));
          const obj1 = {
            success: true,
            total: res.result.albumCount,
            albumList
          };
          resolve(obj1);
        })
        .catch(err => reject({
          success: false,
          message: err
        }));
    });
  }
  return NeteaseRequest('/cloudsearch/get/web?csrf_token=', encData);
};

const getSong = (id, raw, br) => {
  const ids = id.split('.').map(i => Number(i));
  const obj = {
    ids,
    br,
    csrf_token: ''
  };
  const encData = Enc.aesRsaEncrypt(JSON.stringify(obj));
  if (raw) {
    return NeteaseRequest('/song/enhance/player/url?csrf_token=', encData);
  }
  return new Promise((resolve, reject) => {
    NeteaseRequest('/song/enhance/player/url?csrf_token=', encData)
      .then((res) => {
        if (!res.data[0].url) {
          reject({
            success: false,
            message: '网易 - 歌曲需要付费或者ID错误!'
          });
        }
        resolve({
          success: true,
          url: res.data[0].url
        });
      })
      .catch(err => reject({
        success: false,
        message: `网易 - 歌曲需要付费或者ID错误!${err}`
      }));
  });
};

const getAlbum = (id, raw) => {
  const obj = {
    csrf_token: ''
  };
  const encData = Enc.aesRsaEncrypt(JSON.stringify(obj));
  if (raw) {
    return NeteaseRequest(`/v1/album/${id}?csrf_token=`, encData);
  }
  return new Promise((resolve, reject) => {
    NeteaseRequest(`/v1/album/${id}?csrf_token=`, encData)
      .then((res) => {
        const ab = res.songs;
        const songList = ab.map(item => ({
          id: item.id,
          name: item.name,
          needPay: item.fee > 0,
          offlineNow: item.privilege.st < 0,
          artists: item.ar,
          album: {
            id: res.album.id,
            name: res.album.name,
            cover: `${res.album.picUrl.replace('http://', 'https://')}?param=250y250`,
            coverBig: `${res.album.picUrl.replace('http://', 'https://')}?param=400y400`,
            coverSmall: `${res.album.picUrl.replace('http://', 'https://')}?param=140y140`,
          }
        }));
        const obj1 = {
          success: true,
          name: res.album.name,
          id: res.album.id,
          cover: `${res.album.picUrl.replace('http://', 'https://')}?param=250y250`,
          coverBig: `${res.album.picUrl.replace('http://', 'https://')}?param=400y400`,
          coverSmall: `${res.album.picUrl.replace('http://', 'https://')}?param=140y140`,
          needPay: songList[0].needPay,
          offlineNow: songList[0].offlineNow,
          artist: {
            name: res.album.artist.name,
            id: res.album.artist.id
          },
          songList
        };
        resolve(obj1);
      })
      .catch(err => reject({
        success: false,
        message: err
      }));
  });
};

const getPlaylist = (id, raw) => {
  const obj = {
    id,
    n: 1000,
    csrf_token: ''
  };
  const encData = Enc.aesRsaEncrypt(JSON.stringify(obj));
  if (raw) {
    return NeteaseRequest('/v3/playlist/detail?csrf_token=', encData);
  }
  return new Promise((resolve, reject) => {
    NeteaseRequest('/v3/playlist/detail?csrf_token=', encData)
      .then((res) => {
        try {
          const songList = res.playlist.tracks.map((item, index) => ({
            id: item.id,
            name: item.name,
            artists: item.ar,
            needPay: item.fee > 0,
            offlineNow: res.privileges[index].st < 0,
            album: {
              id: item.al.id,
              cover: `${item.al.picUrl.replace('http://', 'https://')}?param=250y250`,
              coverBig: `${item.al.picUrl.replace('http://', 'https://')}?param=400y400`,
              coverSmall: `${item.al.picUrl.replace('http://', 'https://')}?param=140y140`,
              name: item.al.name
            }
          }));
          const obj1 = {
            success: true,
            name: res.playlist.name,
            id,
            cover: null,
            author: {
              id: res.playlist.creator.userId,
              name: res.playlist.creator.nickname,
              avatar: res.playlist.creator.avatarUrl
            },
            songList
          };
          resolve(obj1);
        } catch (e) {
          console.log(e);
          reject({
            success: false,
            message: 'your netease playlist id is not correct or data mapping is not correct, try query with raw=true'
          });
        }
      })
      .catch(err => reject({
        success: false,
        message: err
      }));
  });
};

export default {
  searchSong,
  searchPlaylist,
  searchAlbum,
  getSong,
  getAlbum,
  getPlaylist
};
