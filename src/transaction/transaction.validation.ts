import { z as Zod } from 'zod';
import dayjs from '../tools/dayjs';

import { INVALID_TIMESTAMP, NAME_MAX_LENGTH, INVALID_DATETIME, INVALID_TIME_RANGE } from '../errors/constants';

export const createTransactionSchema = Zod.object({
  name: Zod.string().max(NAME_MAX_LENGTH),
  amount: Zod.number(),
  datetime: Zod.string().datetime({ message: INVALID_DATETIME }),
  categoryId: Zod.string().optional(),
  tagIds: Zod.array(Zod.string()).optional(),
});

export type CreateTransactionInput = Zod.infer<typeof createTransactionSchema>;

export const getTransactionSchema = Zod.object({
  id: Zod.string(),
});

export const updateTransactionSchema = Zod.object({
  transactionId: Zod.string(),
  tagIds: Zod.optional(Zod.array(Zod.string())),
});

export type UpdateTransactionInput = Zod.infer<typeof updateTransactionSchema>;
