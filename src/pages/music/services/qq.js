import Music from './Music';
import { getQueryString } from '../utils';

const requestOption = {
  headers: {
    Referer: 'https://y.qq.com/portal/search.html',
    Host: 'c.y.qq.com'
  }
};
const musicConfig = { source: 'qq' };
const musicApi = new Music(musicConfig);

musicApi.search = async (keyword) => {
  const page = 1;
  const limit = 20;
  const url = 'http://c.y.qq.com/soso/fcgi-bin/search_cp?';
  const query = {
    p: page,
    n: limit,
    w: keyword,
    aggr: 1,
    lossless: 1,
    cr: 1
  };
  const res = await fetch(url + getQueryString(query), requestOption);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const text = await res.text();
  const data = text.substr(0, text.length - 1).replace('callback(', '');
  const result = JSON.parse(data);
  const list = result.data.song.list.map((item) => {
    const song = {
      id: item.songmid,
      title: item.songname,
      artistName: item.singer[0].name,
      artistId: item.singer[0].id,
      albumName: item.albumname,
      albumId: item.albumid,
      sourceUrl: `http://y.qq.com/#type=song&mid=${item.songmid}&tpl=yqq_song_detail`,
      source: musicApi.source,
      key: `${item.songmid}_${musicApi.source}`,
    };
    return song;
  });
  return { list };
};

musicApi.querySongInfo = async (songId) => {
  const url = 'http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg?' +
    'json=3&guid=780782017&g_tk=938407465&loginUin=0&hostUin=0&' +
    'format=jsonp&inCharset=GB2312&outCharset=GB2312&notice=0&' +
    'platform=yqq&jsonpCallback=jsonCallback&needNewCode=0';
  const res = await fetch(url, requestOption);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const text = await res.text();
  const data = text.substr(0, text.length - 2).replace('jsonCallback(', '');
  const result = JSON.parse(data);

  const token = result.key;
  const songUrl = `http://dl.stream.qqmusic.qq.com/C200${songId}.m4a?vkey=${ 
    token}&fromtag=0&guid=780782017`;
  return { url: songUrl };
};

musicApi.queryLyric = async (songId) => {
  const url = `${'http://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg?' +
    'songmid='}${songId 
  }&loginUin=0&hostUin=0&format=jsonp&inCharset=GB2312` +
    '&outCharset=utf-8&notice=0&platform=yqq&jsonpCallback=MusicJsonCallback&needNewCode=0';
  const res = await fetch(url, requestOption);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const text = await res.text();
  const data = text.substr(0, text.length - 1).replace('MusicJsonCallback(', '');
  const result = JSON.parse(data);
  
  const lyric = result.lyric;
  return { lyric };
};

window.musicApiQQ = musicApi;
export default musicApi;
