import crypto from 'crypto';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import {
  SIGN_UP_OK_MESSAGE,
  SIGN_IN_OK_MESSAGE,
} from '../src/auth/auth.constants';
import { getRandomEmail, getRandomPassword } from './tools/auth';
import { ProfileModule } from '../src/profile/profile.module';

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
    test('Sign up', () => {
      const signUpQuery = `
        mutation {
          signUp(email: "${testEmail}" password: "${testPassword}" confirm: "${testPassword}" firstName: "${testFirstName}" lastName: "${testLastName}") {
            message
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signUpQuery,
        })
        .set({
          'Content-type': 'application/json',
        })
        .then((response) => {
          expect(response.body.data.signUp.message).toEqual(SIGN_UP_OK_MESSAGE);
        });
    });

    test('Sign in', () => {
      const signInQuery = `
        mutation {
          signIn(email: "${testEmail}" password: "${testPassword}") {
            jwt_token message
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: signInQuery,
        })
        .set({
          'Content-type': 'application/json',
        })
        .then((response) => {
          expect(response.body.data.signIn.jwt_token).toBeTruthy();
          expect(response.body.data.signIn.message).toBe(SIGN_IN_OK_MESSAGE);
          jwtToken = response.body.data.signIn.jwt_token;
        });
    });
  });

  describe('Profile page auth error', () => {
    const query = '{ profile { user { email } } }';

    test('Get profile', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: query,
        })
        .set({
          'Contet-type': 'application/json',
          Authorization: `Bearer ${jwtToken}1`,
        })
        .then((response) => {
          expect(response.body.errors[0].message).toEqual('Unauthorized');
        });
    });
  });

  describe('Profile page', () => {
    const query = `{
            profile {
                user { email firstName lastName }
            }
        }`;

    test('Get profile', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: query,
        })
        .set({
          'Contet-type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.OK);
          expect(response.body.data.profile.user.email).toEqual(testEmail);
          expect(response.body.data.profile.user.firstName).toEqual(
            testFirstName,
          );
          expect(response.body.data.profile.user.lastName).toEqual(
            testLastName,
          );
        });
    });
  });

  describe('Update profile', () => {
    const newFirstName = 'test1';
    const newLastName = 'test2';

    const mutation = `
            mutation {
                updateProfile(firstName: "${newFirstName}" lastName: "${newLastName}") {
                    user { email firstName, lastName }
                }
            }
        `;

    test('Update profile', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: mutation,
        })
        .set({
          'Content-type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        })
        .then((response) => {
          expect(response.body.data.updateProfile.user.firstName).toEqual(
            newFirstName,
          );
          expect(response.body.data.updateProfile.user.lastName).toEqual(
            newLastName,
          );
        });
    });
  });
});
