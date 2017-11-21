import Music from './Music';
import { neteaseEncryptedRequest } from '../utils';

const NETEASE_API_URL = 'http://music.163.com/weapi';

function getQueryString(object) {
  if (object) {
    return Object.keys(object).reduce((acc, item) => {
      const prefix = !acc ? '' : `${acc}&`;
      return `${prefix + encodeURIComponent(item)}=${Array.isArray(object[item]) ?
        encodeURIComponent(object[item].map(d => JSON.stringify(d)).join(',')) : encodeURIComponent(object[item])}`;
    }, '');
  }
  return object;
}

const NeteaseRequest = async (url, query) => {
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include'
  };
  opts.body = getQueryString(query);
  const res = await fetch(`${NETEASE_API_URL + url}`, opts);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const json = await res.json();
  return json;
};

const musicConfig = { source: 'netease' };
const netease = new Music(musicConfig);

netease.search = async (keyword) => {
  const url = 'http://music.163.com/api/search/pc';
  const param = {
    s: keyword,
    offset: 0,
    limit: 20,
    type: 1
  };
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: getQueryString(param),
  };
  const res = await fetch(`${url}`, requestOptions);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const json = await res.json();
  const list = json.result.songs.map((item) => {
    const song = {
      id: item.id,
      title: item.name,
      artistName: item.artists[0].name,
      artistId: item.artists[0].id,
      albumName: item.album.name,
      albumId: item.album.id,
      sourceUrl: `http://music.163.com/#/song?id=${item.id}`,
      source: netease.source,
      key: `${item.id}_${netease.source}`,
    };
    return song;
  });
  return { list };
};

netease.querySongInfo = async (songId) => {
  const csrf = '';
  const param = {
    ids: [songId],
    br: 320000,
    csrf_token: csrf
  };

  const encData = neteaseEncryptedRequest(param);
  const result = await NeteaseRequest('/song/enhance/player/url?csrf_token=&', encData);
  const url = result.data[0].url;
  return { url };
};

netease.queryLyric = async (songId) => {
  const csrf = '';
  const param = {
    id: songId,
    lv: -1,
    tv: -1,
    csrf_token: csrf
  };

  const encData = neteaseEncryptedRequest(param);
  const result = await NeteaseRequest('/song/lyric?csrf_token=&', encData);
  let lyric = '';
  if (!result.uncollected) {
    lyric = result.lrc.lyric || '';
  }

  return { lyric };
};

export default netease;

