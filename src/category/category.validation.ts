import { z as Zod } from 'zod';
import { NAME_MAX_LENGTH } from '../errors/constants';

export const getCategorySchema = Zod.object({
  id: Zod.string().cuid(),
});

export const createCategorySchema = Zod.object({
  name: Zod.string().max(NAME_MAX_LENGTH),
});

export type GetCategoryInput = Zod.infer<typeof getCategorySchema>;
export type CreateCategoryInput = Zod.infer<typeof createCategorySchema>;
export type NewCategoryPayload = { accountId: string } & CreateCategoryInput;
