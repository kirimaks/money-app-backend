function getErrorMessage(catchedError:unknown):string {
    if (catchedError instanceof Error) {
        return catchedError.message;
    }

    return 'Error message is not provided';
}

export {getErrorMessage}
