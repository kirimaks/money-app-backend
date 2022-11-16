import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import type { SignUpDTO, SignInBody } from './auth.validation';


@Injectable()
export class AuthService {
    private readonly prismaClient: PrismaClientService;

    constructor(prismaClient: PrismaClientService) {
        this.prismaClient = prismaClient;
    }

    createUser(signUpDTO: SignUpDTO) {
        console.log(signUpDTO);
    }

    login(signInBody: SignInBody) {
        console.log(signInBody);
    }
}
