import { z as Zod } from 'zod';
import { INVALID_TIMESTAMP, NAME_MAX_LENGTH } from '../errors/constants';

export const createTransactionSchema = Zod.object({
  name: Zod.string().max(NAME_MAX_LENGTH),
  amount: Zod.number(),
  timestamp: Zod.string().refine(
    (val) => new Date(parseInt(val)).getTime() > 0,
    {
      message: INVALID_TIMESTAMP,
    },
  ),
});

export const getTransactionSchema = Zod.object({
  id: Zod.string(),
});

export const updateTransactionSchema = Zod.object({
  transactionId: Zod.string(),
  tagIds: Zod.optional(Zod.array(Zod.string())),
});

export type UpdateTransactionInput = Zod.infer<typeof updateTransactionSchema>;
