import { z as Zod } from 'zod';
import dayjs from '../tools/dayjs';

import {
  INVALID_TIMESTAMP,
  NAME_MAX_LENGTH,
  INVALID_DATETIME,
  INVALID_TIME_RANGE,
} from '../errors/constants';

export const createTransactionSchema = Zod.object({
  name: Zod.string().max(NAME_MAX_LENGTH),
  amount: Zod.number(),
  datetime: Zod.string().datetime({ message: INVALID_DATETIME }),
  tagIds: Zod.array(Zod.string()).optional(),
});

export type CreateTransactionInput = Zod.infer<typeof createTransactionSchema>;

export const getTransactionSchema = Zod.object({
  id: Zod.string(),
});

export const updateTransactionSchema = Zod.object({
  transactionId: Zod.string(),
  tagIds: Zod.optional(Zod.array(Zod.string())),
  name: Zod.string().max(NAME_MAX_LENGTH),
  amount: Zod.number(),
  datetime: Zod.string().datetime({ message: INVALID_DATETIME }),
});

export type UpdateTransactionInput = Zod.infer<typeof updateTransactionSchema>;

export const latestTransactionsSchema = Zod.object({
  timeRangeStart: Zod.string().datetime({ message: INVALID_DATETIME }),
  timeRangeEnd: Zod.string().datetime({ message: INVALID_DATETIME }),
}).refine(
  (data) => dayjs(data.timeRangeStart).unix() < dayjs(data.timeRangeEnd).unix(),
  {
    message: INVALID_TIME_RANGE,
    path: ['timeRangeEnd'],
  },
);

export type LatestTransactionsInput = Zod.infer<
  typeof latestTransactionsSchema
>;

export const TransactionsRangeSchema = Zod.object({
  timeRangeStart: Zod.string().datetime({ message: INVALID_DATETIME }),
  timeRangeEnd: Zod.string().datetime({ message: INVALID_DATETIME }),
}).refine(
  (data) => dayjs(data.timeRangeStart).unix() < dayjs(data.timeRangeEnd).unix(),
  {
    message: INVALID_TIME_RANGE,
    path: ['timeRangeEnd'],
  },
);

export type TransactionsRangeInput = Zod.infer<
  typeof TransactionsRangeSchema
>;
