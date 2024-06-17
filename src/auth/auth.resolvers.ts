import {
  Logger,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';

import {
  signUpBodySchema,
  signInBodySchema,
  SignUpDTO,
  SignInDTO,
} from './auth.validation';
import { ZodPipe } from '../pipes/zod.pipe';
import { AuthService } from './auth.service';
import {
  SIGN_UP_OK_MESSAGE,
  EMAIL_EXISTS_ERROR,
  SIGN_IN_EMAIL_ERROR,
  SIGN_IN_OK_MESSAGE,
  SIGN_IN_PASSWORD_ERROR,
} from './auth.constants';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';
import {
  EmailExistsError,
  EmailAuthError,
  PasswordAuthError,
} from './auth.errors';

import type { SignUpOK, SignInOK } from './auth.types';

@Resolver('Auth')
export class AuthResolver {
  private readonly logger: Logger;
  private readonly authService: AuthService;

  constructor(logger: Logger, authService: AuthService) {
    this.logger = logger;
    this.authService = authService;
  }

  @Mutation()
  async signUp(
    @Args(new ZodPipe(signUpBodySchema)) signUpDTO: SignUpDTO,
  ): Promise<SignUpOK> {
    try {
      await this.authService.createAccount(signUpDTO);
      return { message: SIGN_UP_OK_MESSAGE };
    } catch (error) {
      if (error instanceof EmailExistsError) {
        throw new BadRequestException(EMAIL_EXISTS_ERROR);
      }
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }

  @Mutation()
  async signIn(
    @Args(new ZodPipe(signInBodySchema)) signInDTO: SignInDTO,
  ): Promise<SignInOK> {
    try {
      const authInfo = await this.authService.login(signInDTO);
      return {
        message: SIGN_IN_OK_MESSAGE,
        jwtToken: authInfo.jwtToken,
	user: authInfo.user,
      };
    } catch (error) {
      if (error instanceof PasswordAuthError) {
        throw new UnauthorizedException(SIGN_IN_PASSWORD_ERROR);
      }

      if (error instanceof EmailAuthError) {
        throw new UnauthorizedException(SIGN_IN_EMAIL_ERROR);
      }
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }
}
