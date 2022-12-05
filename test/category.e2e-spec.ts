import crypto from 'crypto';

import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import cuid from 'cuid';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import { TransactionModule } from '../src/transaction/transaction.module';
import { CategoryModule } from '../src/category/category.module';
import { UserModule } from '../src/user/user.module';
import { isString } from '../src/errors/typeguards';
import {
  getRandomEmail,
  getRandomPassword,
  signUpTool,
  signInTool,
} from './tools/auth';
import { CATEGORY_NOT_FOUND_ERROR } from '../src/errors/constants';
import { WRONG_ERROR_TEXT } from './constants';

import type { CategoryRepresentation } from '../src/category/category.types';

describe('Category test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        GraphqlModule,
        TransactionModule,
        CategoryModule,
        UserModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Create and get category', () => {
    const categoryName = crypto.randomBytes(8).toString('hex');
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();
    let categoryId: string;

    test('Sign up', async () => {
      await signUpTool(app, testEmail, testPassword);
    });

    test('Create new category', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const newCategoryQuery = gql`
        mutation {
          createCategory(name: "${categoryName}") {
            id name
          }
        }
      `;
      const { data } = await request<{
        createCategory: CategoryRepresentation;
      }>(app.getHttpServer())
        .query(newCategoryQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.createCategory.name).toEqual(categoryName);
      expect(data?.createCategory.id).toBeTruthy();

      if (data && isString(data?.createCategory.id)) {
        categoryId = data?.createCategory.id;
      } else {
        throw new Error('Missing category id');
      }
    });

    test('Get category', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const getCategoryQuery = gql`
        query {
          category(id: "${categoryId}") {
            id name
          }
        }
      `;
      const { data } = await request<{ category: CategoryRepresentation }>(
        app.getHttpServer(),
      )
        .query(getCategoryQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.category.id).toEqual(categoryId);
      expect(data?.category.name).toEqual(categoryName);
    });

    test('Get missing category', async () => {
      const missingCuid = cuid();
      const jwtToken = await signInTool(app, testEmail, testPassword);
      const getCategoryQuery = gql`
        query {
          category(id: "${missingCuid}") {
            id name
          }
        }
      `;
      const { errors } = await request(app.getHttpServer())
        .query(getCategoryQuery)
        .set('Authorization', `Bearer ${jwtToken}`);

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(CATEGORY_NOT_FOUND_ERROR);
      } else {
        throw new Error(WRONG_ERROR_TEXT);
      }
    });
  });
});