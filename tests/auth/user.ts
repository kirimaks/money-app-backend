import tap from 'tap';

import { UserDBInstance, UserDBModel } from '../../src/models/auth/user';

tap.test('Saving user database instance', async (test) => {
    const userInstance = new UserDBInstance({
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
    });

    test.equal(userInstance.isSaved, false);
    userInstance.save();

    test.equal(userInstance.isSaved, true);
});

tap.test('Deleting user database instance', async (test) => {
    const userInstance = new UserDBInstance({
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
    });

    test.equal(userInstance.isDeleted, false);
    userInstance.delete();

    test.equal(userInstance.isDeleted, true);
});

tap.test('User db model', async (test) => {
    const userModel = new UserDBModel();
    const user = userModel.create({
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test'
    });
    test.equal(user.isSaved, false);

    user.save();
    test.equal(user.isSaved, true);
});

tap.test('Get user by id', async (test) => {
    const userModel = new UserDBModel();
    const user = userModel.getById('id');
    test.equal(user.isSaved, true);
});

tap.test('Hash user password', async (test) => {
    const userModel = new UserDBModel();
    const user = userModel.create({
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
    });

    await user.setPassword('hello');

    test.ok(user.data.password);

    user.save();
});

tap.test('Hash and verify pasword', async (test) => {
    const password = 'MYPassword128';

    const userModel = new UserDBModel();
    const user = userModel.create({
        email: 'test@test.com',
        firstName: 'test',
        lastName: 'test',
    });

    await user.setPassword(password);
    user.save();

    test.notOk(await user.verifyPassword('random'));
    test.ok(await user.verifyPassword(password));
});
