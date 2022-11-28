import type { User } from '../user/user.types';

export type NewAccountPayload = {
  accountName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type Account = {
  name: string;
  users: User[];
};

export type AccountRepresentation = {
  name: string;
};
