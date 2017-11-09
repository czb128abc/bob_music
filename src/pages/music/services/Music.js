
export async function fetchJSON(input, opts) {
  const res = await fetch(`${input}`, {
    ...opts,
    credentials: 'include',
  });
  if (!res.ok) {
    const err = new Error('network status error');
    err.status = res.status;
    const json = await res.json();
    if (json && json.headers) {
      err.code = json.headers.responseCode;
    }
    throw err;
  }
  const json = await res.json();
  if (json.headers && json.headers.responseCode !== 0) {
    const err = new Error('result code');
    err.code = json.headers.responseCode;
    err.message = json.headers.responseMessage;
    throw err;
  }
  return json.body;
}

export default class Music {
  constructor() {
    this.fetchJSON = fetchJSON;
  }
  queryCoverPlaylist() {
    throw new Error('Music should be abs');
  }

  queryPlaylist() {
    throw new Error('Music should be abs');
  }

  queryAlbum() {
    throw new Error('Music should be abs');
  }

  queryArtist() {
    throw new Error('Music should be abs');
  }

  // 搜索
  search() {
    throw new Error('Music should be abs');
  }

  // 查询 歌曲信息
  querySongInfo() {
    throw new Error('Music should be abs');
  }

  // 查询 歌曲歌词新
  queryLyric() {
    throw new Error('Music should be abs');
  }
}
