import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '../prisma-client/prisma-client.service';

import type { ProfileRepresentation } from './profile.types';


@Injectable()
export class ProfileService {
    private readonly prisma: PrismaClientService;

    constructor(prisma:PrismaClientService) {
        this.prisma = prisma;
    }

    async getProfile(userId:string):Promise<ProfileRepresentation> {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            }
        });

        return {
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        };
    }
}
