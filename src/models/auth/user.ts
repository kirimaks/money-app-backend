import { DBInstance, DBModel } from '../base/model';
import { pbkdf2, randomBytes } from 'crypto';

import type { IDBInstance } from '../base/types';
import type { UserDraft } from './types';


interface IDBUserInstance extends IDBInstance {
    data: UserDraft;
    setPassword(password:string): Promise<string>;
    verifyPassword(password:string): Promise<boolean>;
}

class UserDBInstance extends DBInstance implements IDBUserInstance {
    private pbkdf2Iterations = 10000;
    private pbkdf2keylen = 64;
    private pbkdf2digest = 'sha512';

    data:UserDraft;

    constructor(userDraft:UserDraft) {
        super();

        this.data = userDraft;
    }

    save() {
        this.isSaved = true;
    }

    delete() {
        this.isDeleted = true;
    }

    setPassword(password:string):Promise<string> {
        const salt = randomBytes(32).toString('hex');

        return new Promise((resolve, reject) => {
            pbkdf2(password, salt, this.pbkdf2Iterations, this.pbkdf2keylen, this.pbkdf2digest, (error, derivedKey) => {
                if (error) {
                    reject(error);
                }

                const hash = derivedKey.toString('hex');
                const authHash = Buffer.from(`${hash}-${salt}`).toString('base64');
                this.data.password = authHash;

                resolve(authHash);
            });
        });
    }

    verifyPassword(password:string):Promise<boolean> {
        return new Promise((resolve, reject) => {

            if (this.data.password) {
                const savedHash = Buffer.from(this.data.password, 'base64').toString().split('-');
                const savedPwdHash = savedHash[0];
                const savedSalt = savedHash[1];

                pbkdf2(password, savedSalt, this.pbkdf2Iterations, this.pbkdf2keylen, this.pbkdf2digest, (error, derivedKey) => {
                    if (error) {
                        reject(false);
                    }

                    const hash = derivedKey.toString('hex');

                    resolve(hash === savedPwdHash);
                });

            } else {
                reject(false);
            }
        });
    }
}
class UserDBModel extends DBModel {
    create(draft:UserDraft): IDBUserInstance {
        return new UserDBInstance(draft);
    }

    getById(id:string): IDBInstance {
        const user = new UserDBInstance({
            email: 'test@test.com', 
            firstName: 'test', 
            lastName: 'test'
        });
        user.save();
        return user;
    }
}

export { UserDBInstance, UserDBModel };
