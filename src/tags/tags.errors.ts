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

export class TagNotFoundError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'TagNotFoundError';
  }
}

export class TagExistError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'TagExistError';
  }
}
