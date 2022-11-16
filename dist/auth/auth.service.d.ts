import { PrismaClientService } from '../prisma-client/prisma-client.service';
import type { SignUpDTO, SignInBody } from './auth.validation';
export declare class AuthService {
    private readonly prismaClient;
    constructor(prismaClient: PrismaClientService);
    createUser(signUpDTO: SignUpDTO): void;
    login(signInBody: SignInBody): void;
}
