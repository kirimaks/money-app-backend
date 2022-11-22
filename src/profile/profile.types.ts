import type { UserRepresentation } from '../auth/auth.types';

export type ProfileRepresentation = {
  user: UserRepresentation;
};

export type ProfileUpdatePayload = {
  firstName?: string;
  lastName?: string;
};
