import CryptLib from 'cryptlib';

const _crypt = new CryptLib();

function rsaEncrypt(text, pubKey, modulus) {

}

export function encryptedNeteaseRequest(obj) {
  const modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b72' +
    '5152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbd' +
    'a92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe48' +
    '75d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
  const nonce = '0CoJUm6Qyw8W8jud';
  const pubKey = '010001';
  const text = JSON.stringify(obj);
  // const sec_key = crypt.generateRandomIV(16);
  // const enc_text = _aes_encrypt(_aes_encrypt(text, nonce), sec_key);
  // const enc_sec_key = _rsa_encrypt(sec_key, pubKey, modulus);


  const secKey = _crypt.generateRandomIV(16);
  const key = _crypt.getHashSha256('my secret key', 32);
  const encText = _crypt.encrypt(text, key, secKey);
  const data = {
    params: encText,
    encSecKey: encSeckey
  };

  return data;
}
