export class UserNotFound extends Error {
  message: string;

  constructor(message:string) {
    super(message);
    this.message = message;
    this.name = 'UserNotFound';
  }
}
