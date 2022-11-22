import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { getErrorMessage } from '../errors/tools';
import {
  EmailExistsError,
  AuthError,
  PasswordAuthError,
  EmailAuthError,
} from './auth.errors';
import { PasswordTool } from './auth.hashing';

import type { SignUpDTO, SignInBody } from './auth.validation';
import type { User } from './auth.types';
import type { JWTSignPayload } from './auth.types';

@Injectable()
export class AuthService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;
  private readonly passwordTool: PasswordTool;
  private readonly jwtService: JwtService;

  constructor(
    prisma: PrismaClientService,
    logger: Logger,
    jwtService: JwtService,
  ) {
    this.prisma = prisma;
    this.logger = logger;
    this.passwordTool = new PasswordTool();
    this.jwtService = jwtService;
  }

  async validatePassword(hash: string, password: string) {
    if (await this.passwordTool.validate(hash, password)) {
      return true;
    }

    throw new AuthError('Wrong password');
  }

  async createUser(signUpDTO: SignUpDTO): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          email: signUpDTO.email,
          passwordHash: await this.passwordTool.hash(signUpDTO.password),
          firstName: signUpDTO.firstName,
          lastName: signUpDTO.lastName,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new EmailExistsError('Email exists');
        }
      }
      this.logger.error(error);

      throw new Error(`Cannot create user: ${getErrorMessage(error)}`);
    }
  }

  async login(signInBody: SignInBody): Promise<string> {
    try {
      const user = await this.getUserByEmail(signInBody.email);

      if (await this.validatePassword(user.passwordHash, signInBody.password)) {
        const payload: JWTSignPayload = {
          sub: {
            email: user.email,
            id: user.id,
          },
        };
        return this.jwtService.sign(payload);
      }

      throw new PasswordAuthError(`Authentication error: validation error`);
    } catch (error) {
      if (error instanceof AuthError) {
        throw new PasswordAuthError(
          `Authentication error: wrong email/password`,
        );
      }

      if (error instanceof Prisma.NotFoundError) {
        throw new EmailAuthError(`Authentication error: wrong email/password`);
      }

      this.logger.error(error);

      throw new Error(`Authentication error: ${getErrorMessage(error)}`);
    }
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
  }
}
