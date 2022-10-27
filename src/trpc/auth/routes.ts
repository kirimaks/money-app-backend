import * as trpc from '@trpc/server';
import { z as zod } from 'zod';


type User = {
    id: string;
    name: string;
};

const users: Record<string, User> = {};

export const appRouter = trpc.router().query(
    'login', {
        input: zod.number(),
        async resolve({ input }) {
            return {
                id: input,
                status: 'ok',
            };
        }
    }
);

export type AppRouter = typeof appRouter;
