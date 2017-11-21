import Music from './Music';
import { getQueryString } from '../utils';

const requestOption = {
  method: 'GET',
};

const musicConfig = { source: 'xiami' };
const musicApi = new Music(musicConfig);
musicApi.search = async (keywords) => {
  const targetUrl = `http://api.xiami.com/web?v=2.0&app_key=1&key=${keywords}&page=1&limit=20&callback=jsonp154&r=search/songs`;
  const res = await fetch(targetUrl, requestOption);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const text = await res.text();

  const data = text.substr(0, text.length - 1).replace('jsonp154(', '');
  const result = JSON.parse(data);
  const list = result.data.songs.map((item) => {
    const song = {
      id: item.song_id,
      title: item.song_name,
      artistName: item.artist_name,
      artistId: item.artist_id,
      albumName: item.albumname,
      albumId: item.albumid,
      sourceUrl: `http://www.xiami.com/song/${item.song_id}`,
      source: musicApi.source,
      key: `${item.song_id}_${musicApi.source}`,
    };
    song.lyricUrl = item.lyric_file;
    song.mp3Url = item.listen_file;
    song.imgUrl = item.album_logo;
    return song;
  });
  return { list };
};
musicApi.querySongInfo = async (songId, { mp3Url }) => {
  await setTimeout(() => {}, 0);
  return { url: mp3Url };
};

musicApi.queryLyric = async (songId, { lyricUrl }) => {
  const res = await fetch(lyricUrl, requestOption);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const text = await res.text();
  let lyric = '';

  if (text) {
    lyric = text;
  }
  return { lyric };
};

export default musicApi;
