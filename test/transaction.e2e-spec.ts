import crypto from 'crypto';

import gql from 'graphql-tag';

import request from 'supertest-graphql';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import { getRandomEmail, getRandomPassword, signUpTool, signInTool } from './tools/auth';
import { 
  SIGN_UP_OK_MESSAGE, SIGN_IN_OK_MESSAGE
} from '../src/auth/auth.constants';
import { isString } from '../src/errors/typeguards';
import { TransactionModule } from '../src/transaction/transaction.module';

import type { SignUpOK, SignInOK } from '../src/auth/auth.types';
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
    let transactionId:string;

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
      const { data } = await request<{ createTransaction: TransactionRepresentation }>(app.getHttpServer())
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

      const { data } = await request<{ transaction: TransactionRepresentation }>(app.getHttpServer())
        .query(getTransactionQuery)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expectNoErrors();

      expect(data?.transaction.name).toEqual(transactionName);
      expect(data?.transaction.amount).toEqual(transactionAmount);
      expect(data?.transaction.timestamp).toEqual(transactionTime);
      expect(data?.transaction.id).toEqual(transactionId);
    });
  });
});
