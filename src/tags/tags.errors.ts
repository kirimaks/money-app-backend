export class TagGroupExistError extends Error {
    message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
        this.name = 'TagGroupExistError';
    }
}

export class TagGroupNotFoundError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'TagGroupNotFound';
  }
}
