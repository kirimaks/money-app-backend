export function getErrorMessage(error:unknown):string {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Error message is missing';
}