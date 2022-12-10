

import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import { TransactionModule } from '../src/transaction/transaction.module';
import { UserModule } from '../src/user/user.module';
import { TagsModule } from '../src/tags/tags.module';

import { getRandomEmail, getRandomPassword, signUpTool, signInTool, } from './tools/auth';
import { getRandomString } from './tools/helpers';
import { isString } from '../src/errors/typeguards';

import type { TagGroupRepresentation } from '../src/tags/tags.types';


describe('Testing tags', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        GraphqlModule,
        TransactionModule,
        UserModule,
        TagsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Create tag group and tag', () => {
    const tagGroupName = getRandomString(8);
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();
    let tagGroupId:string;

    test('Sign up', async () => {
      await signUpTool(app, testEmail, testPassword);
    });

    test('Create tag group', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagGroupQuery = gql`
        mutation {
          createTagGroup(name: "${tagGroupName}") {
            id name
          }
        }
      `;

      const { data } = await request<{ createTagGroup: TagGroupRepresentation }>(app.getHttpServer())
        .query(newTagGroupQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.createTagGroup.name).toEqual(tagGroupName);
      expect(data?.createTagGroup.id).toBeTruthy();

      if (data && isString(data?.createTagGroup.id)) {
        tagGroupId = data?.createTagGroup.id;

      } else {
        throw new Error('Missing tag group id');
      }

    });
  });
});
