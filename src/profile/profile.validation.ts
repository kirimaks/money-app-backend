import { z as Zod } from 'zod';
import { NAME_MAX_LENGTH } from '../errors/constants';

export const updateProfileSchema = Zod.object({
  firstName: Zod.string().max(NAME_MAX_LENGTH).default(''),
  lastName: Zod.string().max(NAME_MAX_LENGTH).default(''),
});

export class UpdateProfileInput implements Zod.infer<typeof updateProfileSchema> {
    firstName: string;
    lastName: string;
}
