export class EmailExistsError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'EmailExistsError';
  }
}

export class AuthError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'AuthError';
  }
}

export class PasswordAuthError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'PasswordAuthError';
  }
}

export class EmailAuthError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'EmailAuthError';
  }
}
