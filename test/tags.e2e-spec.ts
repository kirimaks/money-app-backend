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
import { WRONG_ERROR_TEXT } from './constants';
import {
  TAG_GROUP_EXIST_ERROR,
  TAG_GROUP_NOT_FOUND_ERROR,
  TAG_GROUP_REMOVED,
  TAG_REMOVED,
  TAG_NOT_FOUND_ERROR,
  TAG_EXIST_ERROR,
} from '../src/tags/tags.constants';

import type {
  TagRepresentation,
  TagGroupRepresentation,
} from '../src/tags/tags.types';

import type { TransactionRepresentation } from '../src/transaction/transaction.types';

describe('Testing tags', () => {
  const testEmail = getRandomEmail();
  const testPassword = getRandomPassword();
  let app: INestApplication;
  let jwtToken: string;

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
    await signUpTool(app, testEmail, testPassword);
    jwtToken = await signInTool(app, testEmail, testPassword);
  });

  describe('Testing tag group', () => {
    const tagGroupName = getRandomString(8);
    const tagGroupIconName = getRandomString(8);
    const tagName = getRandomString(8);

    let tagGroupId: string;

    test('Create tag group', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagGroupQuery = gql`
            mutation {
                createTagGroup(name: "${tagGroupName}") {
                    id name iconName
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
      expect(data?.createTagGroup.iconName).toEqual('fa-tags');

      if (data && isString(data?.createTagGroup.id)) {
        tagGroupId = data?.createTagGroup.id;
      } else {
        throw new Error('Missing tag group id');
      }
    });

    test('Tag group duplicate', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagGroupQuery = gql`
          mutation {
            createTagGroup(name: "${tagGroupName}") {
              id name iconName
            }
          }
        `;

      const { errors } = await request<{
        createTagGroup: TagGroupRepresentation;
      }>(app.getHttpServer())
        .query(newTagGroupQuery)
        .set(...getAuthHeader(jwtToken));

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(TAG_GROUP_EXIST_ERROR);
      } else {
        throw new Error(WRONG_ERROR_TEXT);
      }
    });

    test('Remove tag group', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const deleteTagGroupQuery = gql`
          mutation {
            deleteTagGroup(tagGroupId: "${tagGroupId}") {
              status
            }
          }
        `;

      const { data } = await request<{ deleteTagGroup: { status: string } }>(
        app.getHttpServer(),
      )
        .query(deleteTagGroupQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      expect(data?.deleteTagGroup.status).toEqual(TAG_GROUP_REMOVED);
    });

    test('Remove missing tag group', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const deleteTagGroupQuery = gql`
        mutation {
          deleteTagGroup(tagGroupId: "hello") {
            status
          }
        }
      `;

      const { errors } = await request(app.getHttpServer())
        .query(deleteTagGroupQuery)
        .set(...getAuthHeader(jwtToken));

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(TAG_GROUP_NOT_FOUND_ERROR);
      } else {
        throw new Error(WRONG_ERROR_TEXT);
      }
    });
  });

  describe('Testing Tags', () => {
    const tagGroupName = getRandomString(8);
    const tagName = getRandomString(8);

    let tagGroupId: string;
    let tagId: string;

    test('Create tag group', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagGroupQuery = gql`
        mutation {
          createTagGroup(name: "${tagGroupName}") {
            id name
          }
        }
      `;

      const tagGroupResponse = await request<{
        createTagGroup: TagGroupRepresentation;
      }>(app.getHttpServer())
        .query(newTagGroupQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      if (tagGroupResponse.data) {
        expect(tagGroupResponse.data.createTagGroup.name).toEqual(tagGroupName);
        expect(tagGroupResponse.data.createTagGroup.id).toBeTruthy();

        tagGroupId = tagGroupResponse.data.createTagGroup.id;
      } else {
        throw new Error('Cannot receive graphql data');
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

      const tagResponse = await request<{ createTag: TagRepresentation }>(
        app.getHttpServer(),
      )
        .query(newTagQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      if (tagResponse.data) {
        expect(tagResponse.data.createTag.name).toEqual(tagName);
        expect(tagResponse.data.createTag.tagGroupId).toEqual(tagGroupId);
        expect(tagResponse.data.createTag.id).toBeTruthy();

        tagId = tagResponse.data.createTag.id;
      } else {
        throw new Error('Cannot receive graphql data');
      }
    });

    test('Create tag duplicate', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagQuery = gql`
        mutation {
          createTag(name: "${tagName}" tagGroupId: "${tagGroupId}") {
            id name tagGroupId
          }
        }
      `;

      const { errors } = await request(app.getHttpServer())
        .query(newTagQuery)
        .set(...getAuthHeader(jwtToken));

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(TAG_EXIST_ERROR);
      } else {
        throw new Error(WRONG_ERROR_TEXT);
      }
    });

    test('Remove tag', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const removeTagQuery = gql`
        mutation {
          deleteTag(tagId: "${tagId}") {
            status
          }
        }
      `;

      const { data } = await request<{ deleteTag: { status: string } }>(
        app.getHttpServer(),
      )
        .query(removeTagQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      expect(data?.deleteTag.status).toEqual(TAG_REMOVED);
    });

    test('Remove missing tag', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const removeTagQuery = gql`
        mutation {
          deleteTag(tagId: "some-missing-id") {
            status
          }
        }
      `;

      const { errors } = await request(app.getHttpServer())
        .query(removeTagQuery)
        .set(...getAuthHeader(jwtToken));

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(TAG_NOT_FOUND_ERROR);
      } else {
        throw new Error(WRONG_ERROR_TEXT);
      }
    });

    test('Create a tag with icon', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const randomName = getRandomString(8);
      const iconName = getRandomString(8);
      const createTagQuery = gql`
        mutation {
          createTag(name: "${randomName}" tagGroupId: "${tagGroupId}" iconName: "${iconName}") {
            id name tagGroupId iconName
          }
        }
      `;

      const resp = await request<{ createTag: TagRepresentation }>(
        app.getHttpServer(),
      )
        .query(createTagQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      if (resp.data) {
        expect(resp.data.createTag.name).toEqual(randomName);
        expect(resp.data.createTag.iconName).toEqual(iconName);
      } else {
        throw new Error('Cannot receive graphql data');
      }
    });
  });

  describe('Create tag group and tag', () => {
    const tagGroupName = getRandomString(8);
    const tagGroupIconName = getRandomString(8);
    const tagName = getRandomString(8);

    let tagGroupId: string;
    let tagId: string;

    test('Create tag group', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newTagGroupQuery = gql`
        mutation {
          createTagGroup(name: "${tagGroupName}" iconName: "${tagGroupIconName}") {
            id name iconName
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
      expect(data?.createTagGroup.iconName).toEqual(tagGroupIconName);

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
      const tagIds = JSON.stringify([tagId]);
      const newTransactionName = getRandomString(8);

      const updateTransactionQuery = gql`
        mutation {
          updateTransaction(transactionId: "${transactionId}" tagIds: ${tagIds} name: "${newTransactionName}" amount: ${transactionAmount} datetime: "${transaction.datetime}" ) {
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

      expect(data?.updateTransaction.tags.map((tag) => tag.id)).toContain(
        tagId,
      );

      expect(data?.updateTransaction.name).toEqual(newTransactionName);
    });
  });
});
