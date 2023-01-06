import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getAuthHeader } from './tools/auth';
import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import { UserModule } from '../src/user/user.module';
import { TagsModule } from '../src/tags/tags.module';

import {
  getRandomEmail,
  getRandomPassword,
  signUpTool,
  signInTool,
} from './tools/auth';

import type { TagGroupRepresentation } from '../src/tags/tags.types';

describe('Testing account', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, GraphqlModule, UserModule, TagsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Create account and make sure default tags are created', () => {
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();

    test('Sign up', async () => {
      await signUpTool(app, testEmail, testPassword);
    });

    test('Account default tags', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const accountTagsQuery = gql`
        query {
          accountTags {
            id
            name
            tags {
              id
              name
            }
          }
        }
      `;

      const { data } = await request<{ accountTags: TagGroupRepresentation[] }>(
        app.getHttpServer(),
      )
        .query(accountTagsQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      expect(data?.accountTags).not.toHaveLength(0);
    });
  });
});
