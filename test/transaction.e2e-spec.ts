import crypto from 'crypto';

import gql from 'graphql-tag';

import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import {
  getRandomEmail,
  getRandomPassword,
  signUpTool,
  signInTool,
} from './tools/auth';
import { isString } from '../src/errors/typeguards';
import { TransactionModule } from '../src/transaction/transaction.module';
import { TRANSACTION_NOT_FOUND_ERROR, AUTHORIZATION_ERROR } from '../src/errors/constants';

import type { TransactionRepresentation } from '../src/transaction/transaction.types';

describe('Transaction test', () => {
  let app: INestApplication;
  const testEmail = getRandomEmail();
  const testPassword = getRandomPassword();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, GraphqlModule, TransactionModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Create and get transaction', () => {
    const transactionName = crypto.randomBytes(8).toString('hex');
    const transactionAmount = parseFloat((Math.random() * 100).toFixed(2));
    const transactionTime = new Date().getTime();
    let transactionId: string;

    test('New transaction', async () => {
      await signUpTool(app, testEmail, testPassword);
      const jwtToken = await signInTool(app, testEmail, testPassword);

      const newTransactionQuery = gql`
        mutation {
          createTransaction(name: "${transactionName}" amount: ${transactionAmount} timestamp: "${transactionTime}") {
            name amount timestamp id
          }
        }
      `;
      const { data } = await request<{
        createTransaction: TransactionRepresentation;
      }>(app.getHttpServer())
        .query(newTransactionQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.createTransaction.name).toEqual(transactionName);
      expect(data?.createTransaction.amount).toEqual(transactionAmount);
      expect(data?.createTransaction.timestamp).toEqual(transactionTime);
      expect(data?.createTransaction.id).toBeTruthy();

      if (data && isString(data?.createTransaction.id)) {
        transactionId = data?.createTransaction.id;
      }
    });

    test('Get Transaction', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);
      expect(transactionId).toBeTruthy();

      const getTransactionQuery = gql`
        query {
          transaction(id: "${transactionId}") {
            name amount timestamp id
          }
        }
      `;

      const { data } = await request<{
        transaction: TransactionRepresentation;
      }>(app.getHttpServer())
        .query(getTransactionQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.transaction.name).toEqual(transactionName);
      expect(data?.transaction.amount).toEqual(transactionAmount);
      expect(data?.transaction.timestamp).toEqual(transactionTime);
      expect(data?.transaction.id).toEqual(transactionId);
    });

    test('Auth for transactions', async () => {
      expect(transactionId).toBeTruthy();

      const getTransactionQuery = gql`
        query {
          transaction(id: "${transactionId}") {
            name amount timestamp id
          }
        }
      `;
      const { errors } = await request(app.getHttpServer())
        .query(getTransactionQuery);

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(AUTHORIZATION_ERROR);
      } else {
        throw new Error('Received wrong error');
      }
    });

    test('Trying to get transaction from another account', async () => {
      const email = getRandomEmail();
      const password = getRandomPassword();

      await signUpTool(app, email, password);
      const jwtToken = await signInTool(app, email, password);

      expect(transactionId).toBeTruthy();
      expect(jwtToken).toBeTruthy();

      const getTransactionQuery = gql`
        query {
          transaction(id: "${transactionId}") {
            name amount timestamp id
          }
        }
      `;
      const { errors } = await request(app.getHttpServer())
        .query(getTransactionQuery)
        .set('Authorization', `Bearer ${jwtToken}`);

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(TRANSACTION_NOT_FOUND_ERROR);
      } else {
        throw new Error('Received wrong error');
      }

    });
  });

  describe('Getting missing transaction', () => {
    test('Missing transaction', async () => {
      const jwtToken = await signInTool(app, testEmail, testPassword);

      const getTransactionQuery = gql`
        query {
          transaction(id: "1234") {
            name amount timestamp id
          }
        }
      `;
      const { errors } = await request(app.getHttpServer())
        .query(getTransactionQuery)
        .set('Authorization', `Bearer ${jwtToken}`);

      if (errors && errors.length > 0) {
        const errorText = errors[0].message;
        expect(errorText).toEqual(TRANSACTION_NOT_FOUND_ERROR);

      } else {
        throw new Error('Received wrong error');
      }
    });
  });
});