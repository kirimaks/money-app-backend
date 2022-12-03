import crypto from 'crypto';
import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import gql from 'graphql-tag';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import {
  getRandomEmail,
  getRandomPassword,
  signUpTool,
  signInTool,
} from './tools/auth';
import { ProfileModule } from '../src/profile/profile.module';

import type { ProfileRepresentation } from '../src/profile/profile.types';

describe('Profile test', () => {
  const testEmail = getRandomEmail();
  const testPassword = getRandomPassword();
  const testFirstName = crypto.randomBytes(8).toString('hex');
  const testLastName = crypto.randomBytes(8).toString('hex');
  const testAccountName = crypto.randomBytes(8).toString('hex');

  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, GraphqlModule, ProfileModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await signUpTool(
      app,
      testEmail,
      testPassword,
      testFirstName,
      testLastName,
      testAccountName,
    );
    jwtToken = await signInTool(app, testEmail, testPassword);
  });

  describe('Profile page auth error', () => {
    test('Get profile', async () => {
      const query = gql`
        {
          profile {
            user {
              email
            }
          }
        }
      `;
      const { errors } = await request(app.getHttpServer()).query(query);

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
      const query = gql`
        {
          profile {
            user {
              email
              firstName
              lastName
            }
            account {
              name
            }
          }
        }
      `;
      const { data } = await request<{ profile: ProfileRepresentation }>(
        app.getHttpServer(),
      )
        .query(query)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.profile.user.email).toEqual(testEmail);
      expect(data?.profile.user.firstName).toEqual(testFirstName);
      expect(data?.profile.user.lastName).toEqual(testLastName);
      expect(data?.profile.account.name).toEqual(testAccountName);
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

      const { data } = await request<{ updateProfile: ProfileRepresentation }>(
        app.getHttpServer(),
      )
        .query(updateQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.updateProfile.user.firstName).toEqual(newFirstName);
      expect(data?.updateProfile.user.lastName).toEqual(newLastName);
    });
  });
});
