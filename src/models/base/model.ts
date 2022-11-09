import type { IDBInstance } from './types';


abstract class DBInstance implements IDBInstance {
    isSaved = false;
    isDeleted = false;

    abstract save(): void;
    abstract delete(): void;
}

abstract class DBModel {
    abstract create(draft:unknown):unknown;
    abstract getById(id:string):unknown;
}

export { DBInstance, DBModel };
