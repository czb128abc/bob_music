import 'isomorphic-fetch';
import querystring from 'querystring';

const baseUrl = 'https://music-api-pjheqeosjj.now.sh/api';

function request(url, methodType, opts = {}) {
  return new Promise((resolve, reject) => {
    fetch(url, opts)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err));
  });
}
const api = {
  searchSong(vendor, queryParam) {
    const paramUrl = querystring.stringify(queryParam);
    return request(`${baseUrl}/search/song/${vendor}?${paramUrl}`, 'GET');
  },
  searchAlbum(vendor, queryParam) {
    const paramUrl = querystring.stringify(queryParam);
    return request(`${baseUrl}/search/album/${vendor}?${paramUrl}`, 'GET');
  },
  searchPlaylist(vendor, queryParam) {
    const paramUrl = querystring.stringify(queryParam);
    return request(`${baseUrl}/search/playlist/${vendor}?${paramUrl}`, 'GET');
  },
  getSong(vendor, queryParam) {
    const paramUrl = querystring.stringify(queryParam);
    return request(`${baseUrl}/get/song/${vendor}?${paramUrl}`, 'GET');
  },
  getAlbum(vendor, queryParam) {
    const paramUrl = querystring.stringify(queryParam);
    return request(`${baseUrl}/get/album/${vendor}?${paramUrl}`, 'GET');
  },
  getPlaylist(vendor, queryParam) {
    const paramUrl = querystring.stringify(queryParam);
    return request(`${baseUrl}/get/playlist/${vendor}?${paramUrl}`, 'GET');
  },
  getSuggestAlbums(vendor, queryParam) {
    const paramUrl = querystring.stringify(queryParam);
    return request(`${baseUrl}/suggest/album${vendor}?${paramUrl}`, 'GET');
  },
};

export default api;
