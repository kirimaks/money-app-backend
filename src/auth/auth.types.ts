import type { UserInRequest, User } from '../user/user.types';

export type JWTSignPayload = {
  sub: UserInRequest;
};

export type SignUpOK = {
  message: string;
};

export type SignInOK = {
  message: string;
  jwtToken: string;
  user: User;
};
