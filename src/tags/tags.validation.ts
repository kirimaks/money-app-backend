import { z as Zod } from 'zod';

import { NAME_MAX_LENGTH, INVALID_DATETIME } from '../errors/constants';

export const createTagGroupSchema = Zod.object({
  name: Zod.string().max(NAME_MAX_LENGTH),
  iconName: Zod.optional(Zod.string().max(100)),
});

export type CreateTagGroupInput = Zod.infer<typeof createTagGroupSchema>;

export const createTagSchema = Zod.object({
  name: Zod.string({ required_error: 'Tag name is required' }).max(
    NAME_MAX_LENGTH,
    'Too long',
  ),
  tagGroupId: Zod.string({ required_error: 'Group id is required' }).min(
    1,
    'Tag group cannot be empty',
  ),
  iconName: Zod.optional(Zod.string()),
});

export type CreateTagInput = Zod.infer<typeof createTagSchema>;

export const deleteTagGroupSchema = Zod.object({
  tagGroupId: Zod.string({ required_error: 'tagGroupId is required' }).max(100),
});
export type DeleteTagGroupInput = Zod.infer<typeof deleteTagGroupSchema>;

export const deleteTagSchema = Zod.object({
  tagId: Zod.string({ required_error: 'tagId is required' }).max(100),
});
export type DeleteTagInput = Zod.infer<typeof deleteTagSchema>;

export const transactionsByTagAggregationSchema = Zod.object({
  timeRangeStart: Zod.string().datetime({ message: INVALID_DATETIME }),
  timeRangeEnd: Zod.string().datetime({ message: INVALID_DATETIME })
});
export type TransactionsByTagAggregationInput = Zod.infer<typeof transactionsByTagAggregationSchema>;
