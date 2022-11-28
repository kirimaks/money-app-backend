import type { UserRepresentation } from '../user/user.types';
import type { AccountRepresentation } from '../account/account.types';


export type ProfileRepresentation = {
  user: UserRepresentation;
  account: AccountRepresentation;
};
