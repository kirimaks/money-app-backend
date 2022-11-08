import { Prisma, PrismaClient } from '@prisma/client';

import type { FastifyLoggerInstance } from 'fastify';
import type { SignUpPayload, SignInPayload } from './types';


const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});


class UserExistError extends Error {
    constructor(message:string) {
        super();
        this.message = message;
    }
}

class AuthError extends Error {
    constructor(message:string) {
        super();
        this.message = message;
    }
}

function getErrorMessage(error:unknown):string {
    if (error instanceof Error) {
        return error.message;
    }

    return 'Error message is missing';
}

async function createUser(logger:FastifyLoggerInstance, payload:SignUpPayload):Promise<string> {
    try {
        const user = await prisma.user.create({
            data: {
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
            }
        });

        logger.debug(`User created: ${JSON.stringify(user)}`);

        return user.email;

    } catch(error) {
        logger.error(`Cannot create user: ${error}`);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new UserExistError('User exist');
            }
        }

    } finally {
        await prisma.$disconnect();
    }

    throw new Error('Cannot create user, please try again');
}

async function login(logger:FastifyLoggerInstance, payload:SignInPayload):Promise<string> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if (user) {
            return user.email;
        }

        throw new AuthError('<<< Auth error >>>');

    } catch(error) {
        logger.error(`Login error: ${error}`);

        if (error instanceof AuthError) {
            throw error;
        }

    } finally {
        await prisma.$disconnect();
    }

    throw new Error('Authentication failed, please try again');
}

export { createUser, UserExistError, AuthError, login, getErrorMessage };
