import crypto from 'crypto';

import { Password } from './auth.hashing';


describe('Password hashing', () => {
    const password = new Password();

    test('Checking generated hashes', async () => {
        const randomPassword = crypto.randomBytes(12).toString('hex');
        const hash = await password.hash(randomPassword);

        return password.validate(hash, randomPassword).then(result => {
            expect(result).toBeTruthy();
        });
    });
});
