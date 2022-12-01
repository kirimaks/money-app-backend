import { z as Zod } from 'zod';


export const createTransactionSchema = Zod.object({
  name: Zod.string(),
  amount: Zod.number(),
  timestamp: Zod.string(),
});
