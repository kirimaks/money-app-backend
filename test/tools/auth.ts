import crypto from 'crypto';

export function getRandomEmail() {
  return [
    crypto.randomBytes(8).toString('hex'),
    '@',
    crypto.randomBytes(8).toString('hex'),
    '.com',
  ].join('');
}

export function getRandomPassword() {
  return (
    crypto.randomBytes(8).toString('hex').toUpperCase() +
    crypto.randomBytes(8).toString('hex').toLowerCase()
  );
}
