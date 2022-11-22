import { z as Zod } from 'zod';

export const profileMutationSchema = Zod.object({
  firstName: Zod.string(),
  lastName: Zod.string(),
});
