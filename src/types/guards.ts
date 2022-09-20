function isString(obj:unknown): obj is string {
    if (typeof obj === 'string') {
        return true;
    }

    return false;
}

export { isString }
