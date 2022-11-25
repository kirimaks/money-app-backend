import crypto from 'crypto';
import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import gql from 'graphql-tag';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import {
  SIGN_UP_OK_MESSAGE,
  SIGN_IN_OK_MESSAGE,
} from '../src/auth/auth.constants';
import { getRandomEmail, getRandomPassword } from './tools/auth';
import { ProfileModule } from '../src/profile/profile.module';
import { isString } from '../src/errors/typeguards';

import type { SignUpOK, SignInOK } from '../src/auth/auth.types';
import type { ProfileRepresentation } from '../src/profile/profile.types';


describe('Profile test', () => {
  const testEmail = getRandomEmail();
  const testPassword = getRandomPassword();
  const testFirstName = crypto.randomBytes(8).toString('hex');
  const testLastName = crypto.randomBytes(8).toString('hex');
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, GraphqlModule, ProfileModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('GraphQL auth', () => {
    test('Sign up', async () => {
      const signUpQuery = gql`
        mutation {
          signUp(email: "${testEmail}" password: "${testPassword}" confirm: "${testPassword}" firstName: "${testFirstName}" lastName: "${testLastName}") {
            message
          }
        }
      `;
      const { data } = await request<{signUp: SignUpOK}>(app.getHttpServer())
        .query(signUpQuery)
        .expectNoErrors();

      expect(data?.signUp.message).toEqual(SIGN_UP_OK_MESSAGE);
    });

    test('Sign in', async () => {
        const signInQuery = gql`
          mutation {
            signIn(email: "${testEmail}" password: "${testPassword}") {
              jwt_token message
            }
          }
        `;

        const { data } = await request<{signIn: SignInOK}>(app.getHttpServer())
          .query(signInQuery)
          .expectNoErrors();

        expect(data?.signIn?.jwt_token).toBeTruthy();
        expect(data?.signIn?.message).toBe(SIGN_IN_OK_MESSAGE);

        const token = data?.signIn?.jwt_token;
        if (isString(token)) {
            jwtToken = token;
        }
    });
  });

  describe('Profile page auth error', () => {
    test('Get profile', async () => {
      const query = gql`{ profile { user { email } } }`;
      const { errors }= await request(app.getHttpServer())
        .query(query);

      expect(errors?.length).toBeGreaterThanOrEqual(1);

      if (errors && errors.length > 0) {
        expect(errors[0].message).toEqual('Unauthorized');

      } else {
        throw new Error('Wrong error message');
      }
    });
  });

  describe('Profile page', () => {
    test('Get profile', async () => {
      const query = gql`{
        profile {
          user { email firstName lastName }
        }
      }`;
      const { data } = await request<{profile: ProfileRepresentation}>(app.getHttpServer())
        .query(query)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.profile.user.email).toEqual(testEmail);
      expect(data?.profile.user.firstName).toEqual(testFirstName);
      expect(data?.profile.user.lastName).toEqual(testLastName);
    });
  });

  describe('Update profile', () => {
    const newFirstName = 'test1';
    const newLastName = 'test2';

    test('Update profile', async () => {
      const updateQuery = gql`
          mutation {
              updateProfile(firstName: "${newFirstName}" lastName: "${newLastName}") {
                  user { email firstName, lastName }
              }
          }
      `;

      const { data } = await request<{updateProfile: ProfileRepresentation}>(app.getHttpServer())
        .query(updateQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.updateProfile.user.firstName).toEqual(newFirstName);
      expect(data?.updateProfile.user.lastName).toEqual(newLastName);
    });
  });
});
