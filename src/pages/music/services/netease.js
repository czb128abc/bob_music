import Music from './Music';

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


const netease = new Music();

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
  return json.body;
};

netease.querySongInfo = async (songId) => {
  const url = 'http://music.163.com/weapi/song/enhance/player/url?csrf_token=';
  const csrf = '';
  const param = {
    ids: [songId],
    br: 320000,
    csrf_token: csrf
  };
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const res = await fetch(`${url}?${getQueryString(param)}`, requestOptions);
  if (!res.ok) {
    const err = new Error('network status error');
    throw err;
  }
  const json = await res.json();
  return json.body;
};

export default netease;

