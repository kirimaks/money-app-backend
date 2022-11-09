export interface IDBInstance {
    isSaved: boolean;
    isDeleted: boolean;
    save(): void;
    delete(): void;
}
