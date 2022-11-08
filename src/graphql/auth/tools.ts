import { Prisma, PrismaClient } from '@prisma/client';

import type { FastifyLoggerInstance } from 'fastify';
import type { SignUpPayload } from './types';


const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});


class UserExistError extends Error {
    constructor(message:string) {
        super();
        this.message = message;
    }
}

async function createUser(logger:FastifyLoggerInstance, payload:SignUpPayload):Promise<void> {
    try {
        const user = await prisma.user.create({
            data: {
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
            }
        });

        logger.debug(`User created: ${JSON.stringify(user)}`);

    } catch(error) {
        logger.error(`Cannot create user: ${error}`);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new UserExistError('User exist');
            }
        }

        throw new Error('Cannot create user, please try again');

    } finally {
        await prisma.$disconnect();
    }
}

export { createUser, UserExistError };
