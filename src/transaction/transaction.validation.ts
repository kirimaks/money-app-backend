import { z as Zod } from 'zod';
import { INVALID_TIMESTAMP } from '../errors/constants';


export const createTransactionSchema = Zod.object({
  name: Zod.string(),
  amount: Zod.number(),
  timestamp: Zod.string().refine(
      (val) => new Date(parseInt(val)).getTime() > 0, {
      message: INVALID_TIMESTAMP
  })
});
