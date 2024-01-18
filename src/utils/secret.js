import CryptoJS from 'crypto'

export function randomStr(length) {
  return CryptoJS.randomBytes(length).toString('hex').slice(0, length);
}
