import crypto from 'crypto';

export function getRandomString(len: number): string {
  return crypto.randomBytes(len).toString('hex');
}
