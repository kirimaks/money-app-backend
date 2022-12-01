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
  let jwtToken: string;
  const testEmail = getRandomEmail();
  const testPassword = getRandomPassword();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, GraphqlModule, TransactionModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await signUpTool(app, testEmail, testPassword);
    jwtToken = await signInTool(app, testEmail, testPassword);
  });

  describe('Create transaction', () => {
    test('Sign in', async () => {
      expect(jwtToken).toBeTruthy();
    });

    test('New transaction', async () => {
      const transactionName = crypto.randomBytes(8).toString('hex');
      const transactionAmount = Math.round(Math.random() * 1000);
      const transactionTime = new Date().getTime().toString();

      const newTransactionQuery = gql`
        mutation {
          createTransaction(name: "${transactionName}" amount: ${transactionAmount} timestamp: "${transactionTime}") {
            name amount timestamp
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
    });
  });
});
