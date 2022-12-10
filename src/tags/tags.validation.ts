import { z as Zod } from 'zod';

import { NAME_MAX_LENGTH } from '../errors/constants';


export const createTagGroupSchema = Zod.object({
  name: Zod.string().max(NAME_MAX_LENGTH),
});

export type CreateTagGroupInput = Zod.infer<typeof createTagGroupSchema>;
