import type { UserInRequest } from '../user/user.types';

export type JWTSignPayload = {
  sub: UserInRequest;
};

export type SignUpOK = {
  message: string;
};

export type SignInOK = {
  message: string;
  jwt_token: string;
};
