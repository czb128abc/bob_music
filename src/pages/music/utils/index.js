import Crypto from 'music-api/src/crypto';

export function neteaseEncryptedRequest(data) {
  return Crypto.aesRsaEncrypt(JSON.stringify(data));
}

export function getQueryString(object) {
  if (object) {
    return Object.keys(object).reduce((acc, item) => {
      const prefix = !acc ? '' : `${acc}&`;
      return `${prefix + encodeURIComponent(item)}=${Array.isArray(object[item]) ?
        encodeURIComponent(object[item].map(d => JSON.stringify(d)).join(',')) : encodeURIComponent(object[item])}`;
    }, '');
  }
  return object;
}
