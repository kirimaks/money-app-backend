import { Injectable, Logger } from '@nestjs/common';
import { PrismaClientService } from '../prisma-client/prisma-client.service';

import type { SignUpDTO, SignInBody } from './auth.validation';


@Injectable()
export class AuthService {
    private readonly prismaClient: PrismaClientService;
    private readonly logger: Logger;

    constructor(prismaClient: PrismaClientService, logger:Logger) {
        this.prismaClient = prismaClient;
        this.logger = logger;
    }

    createUser(signUpDTO: SignUpDTO) {
        this.logger.log(signUpDTO);
    }

    login(signInBody: SignInBody) {
        this.logger.log(signInBody);
    }
}
