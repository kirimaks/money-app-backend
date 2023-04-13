import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import { TransactionModule } from '../src/transaction/transaction.module';
import { UserModule } from '../src/user/user.module';
import { TagsModule } from '../src/tags/tags.module';

import {
  getRandomEmail,
  getRandomPassword,
  signUpTool,
  signInTool,
} from './tools/auth';
import { getRandomString } from './tools/helpers';
import { isString } from '../src/errors/typeguards';
import { getAuthHeader } from './tools/auth';
import { getTransactionTime, getTransactionAmount } from './tools/transactions';
import { createTransaction } from './tools/transactions';

import type {
  TagRepresentation,
  TagGroupRepresentation,
} from '../src/tags/tags.types';

import type { TransactionRepresentation } from '../src/transaction/transaction.types';

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
    const tagGroupIconName = getRandomString(8);
    const tagName = getRandomString(8);

    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();

    let tagGroupId: string;
    let tagId: string;

    test('Sign up', async () => {
      await signUpTool(app, testEmail, testPassword);
    });

    test('Create tag group', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagGroupQuery = gql`
        mutation {
          createTagGroup(name: "${tagGroupName}" icon: "${tagGroupIconName}") {
            id name iconInfo
          }
        }
      `;

      const { data } = await request<{
        createTagGroup: TagGroupRepresentation;
      }>(app.getHttpServer())
        .query(newTagGroupQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      expect(data?.createTagGroup.name).toEqual(tagGroupName);
      expect(data?.createTagGroup.id).toBeTruthy();
      expect(data?.createTagGroup.iconInfo).toEqual(tagGroupIconName);

      if (data && isString(data?.createTagGroup.id)) {
        tagGroupId = data?.createTagGroup.id;
      } else {
        throw new Error('Missing tag group id');
      }
    });

    test('Create tag', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagQuery = gql`
        mutation {
          createTag(name: "${tagName}" tagGroupId: "${tagGroupId}") {
            id name tagGroupId
          }
        }
      `;

      const { data } = await request<{ createTag: TagRepresentation }>(
        app.getHttpServer(),
      )
        .query(newTagQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      expect(data?.createTag.name).toEqual(tagName);
      expect(data?.createTag.tagGroupId).toEqual(tagGroupId);
      expect(data?.createTag.id).toBeTruthy();

      if (data && isString(data?.createTag.id)) {
        tagId = data?.createTag.id;
      } else {
        throw new Error('Missing tag id');
      }
    });

    test('Create transaction with tag', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);

      const transactionName = getRandomString(8);
      const transactionTime = getTransactionTime();
      const transactionAmount = getTransactionAmount();

      const transaction = await createTransaction(
        app,
        jwtToken,
        transactionName,
        transactionTime,
        transactionAmount,
        [tagId],
      );

      expect(transaction.name).toEqual(transactionName);
      expect(transaction.tags[0].id).toEqual(tagId);
      expect(transaction.tags[0].name).toEqual(tagName);
    });

    test('Update transaction (set tag)', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);

      const transactionName = getRandomString(8);
      const transactionTime = getTransactionTime();
      const transactionAmount = getTransactionAmount();

      const transaction = await createTransaction(
        app,
        jwtToken,
        transactionName,
        transactionTime,
        transactionAmount,
      );

      expect(transaction.name).toEqual(transactionName);
      expect(transaction.tags).toHaveLength(0);
      expect(transaction.id).toBeTruthy();

      const transactionId = transaction.id;
      const updateTransactionQuery = gql`
        mutation {
          updateTransaction(transactionId: "${transactionId}" tagIds: ${JSON.stringify(
        [tagId],
      )} ) {
            id name amount datetime
            tags {
              id
            }
          }
        }
      `;

      const { data } = await request<{
        updateTransaction: TransactionRepresentation;
      }>(app.getHttpServer())
        .query(updateTransactionQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      expect(data?.updateTransaction.tags.map(tag => tag.id)).toContain(tagId);
    });
  });
});
