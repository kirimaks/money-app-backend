import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

import { getErrorMessage } from '../errors/tools';
import { AuthError, PasswordAuthError, EmailAuthError } from './auth.errors';
import { PasswordTool } from './auth.hashing';

import { AccountService } from '../account/account.service';
import { UserService } from '../user/user.service';
import { SIGN_IN_PASSWORD_ERROR, SIGN_IN_EMAIL_ERROR } from './auth.constants';

import type { SignUpDTO, SignInDTO } from './auth.validation';
import type { JWTSignPayload } from './auth.types';
import type { Account } from '../account/account.types';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  private readonly passwordTool: PasswordTool;
  private readonly jwtService: JwtService;
  private readonly accountService: AccountService;
  private readonly userService: UserService;

  constructor(
    logger: Logger,
    jwtService: JwtService,
    accountService: AccountService,
    userService: UserService,
  ) {
    this.logger = logger;
    this.passwordTool = new PasswordTool();
    this.jwtService = jwtService;

    this.accountService = accountService;
    this.userService = userService;
  }

  async validatePassword(hash: string, password: string) {
    if (await this.passwordTool.validate(hash, password)) {
      return true;
    }

    throw new AuthError('Wrong password');
  }

  async login(signInBody: SignInDTO): Promise<string> {
    try {
      const user = await this.userService.getUserByEmail(signInBody.email);

      if (await this.validatePassword(user.passwordHash, signInBody.password)) {
        const payload: JWTSignPayload = {
          sub: {
            email: user.email,
            id: user.id,
          },
        };
        return this.jwtService.sign(payload);
      }

      throw new PasswordAuthError(SIGN_IN_PASSWORD_ERROR);

    } catch (error) {
      if (error instanceof AuthError) {
        throw new PasswordAuthError(SIGN_IN_PASSWORD_ERROR);
      }

      if (error instanceof Prisma.NotFoundError) {
        throw new EmailAuthError(SIGN_IN_EMAIL_ERROR);
      }

      this.logger.error(error);

      throw new Error(`Authentication error: ${getErrorMessage(error)}`);
    }
  }

  async createAccount(signUpDTO: SignUpDTO): Promise<Account> {
    return await this.accountService.createAccount({
      accountName: signUpDTO.accountName,
      email: signUpDTO.email,
      password: signUpDTO.password,
      firstName: signUpDTO.firstName,
      lastName: signUpDTO.lastName,
    });
  }
}
