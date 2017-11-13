import Crypto from 'music-api/src/crypto';

export function neteaseEncryptedRequest(data) {
  return Crypto.aesRsaEncrypt(JSON.stringify(data));
}
