
export default class Music {
  constructor({ source }) {
    this.source = source;
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
