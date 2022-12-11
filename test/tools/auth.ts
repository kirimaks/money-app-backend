import crypto from 'crypto';

import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import request from 'supertest-graphql';

import { isString } from '../../src/errors/typeguards';

import type { SignUpOK, SignInOK } from '../../src/auth/auth.types';

export function getRandomEmail() {
  return [
    crypto.randomBytes(8).toString('hex'),
    '@',
    crypto.randomBytes(8).toString('hex'),
    '.com',
  ].join('');
}

export function getRandomPassword() {
  return (
    crypto.randomBytes(8).toString('hex').toUpperCase() +
    crypto.randomBytes(8).toString('hex').toLowerCase()
  );
}

export async function signUpTool(
  app: INestApplication,
  email: string,
  password: string,
  firstName = '',
  lastName = '',
  accountName = '',
): Promise<void> {
  const signUpQuery = gql`
    mutation {
      signUp(
        email: "${email}" password: "${password}" confirm: "${password}" 
        firstName: "${firstName}" lastName: "${lastName}" accountName: "${accountName}"
      ) {
        message
      }
    }
  `;

  const httpServer = app.getHttpServer();

  await request<{ singUp: SignUpOK }>(httpServer).query(signUpQuery);
}

export async function signInTool(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const signInQuery = gql`
    mutation {
      signIn(email: "${email}" password: "${password}") {
        jwt_token message
      }
    }
  `;

  const httpServer = app.getHttpServer();

  const { data } = await request<{ signIn: SignInOK }>(httpServer).query(
    signInQuery,
  );

  const token = data?.signIn?.jwt_token;

  if (isString(token)) {
    return token;
  }

  throw new Error(`Sign in failed, empty token: ${typeof token}`);
}

export function getAuthHeader(jwtToken:string):[string, string] {
  return ['Authorization', `Bearer ${jwtToken}`];
}
