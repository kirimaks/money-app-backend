export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  accountId: string;
};

export type UserRepresentation = Pick<User, 'email' | 'firstName' | 'lastName'>;
export type UserInRequest = Pick<User, 'id' | 'accountId'>;
