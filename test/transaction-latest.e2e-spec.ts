import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest-graphql';
import gql from 'graphql-tag';

import { getRandomEmail, getRandomPassword, signUpTool, signInTool, } from './tools/auth';
import { AuthModule } from '../src/auth/auth.module'; import { GraphqlModule } from '../src/graphql/graphql.module';
import { createTransaction } from './tools/transactions';
import { TransactionModule } from '../src/transaction/transaction.module';
import { getAuthHeader } from './tools/auth';

import type { LatestTransactionsByDay } from '../src/transaction/transaction.types';


describe('Latest transactions test', () => {
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

  test('Latest transactions', async () => {
    await signUpTool(app, testEmail, testPassword);
    const jwtToken = await signInTool(app, testEmail, testPassword);

    await createTransaction(app, jwtToken, 't1', (new Date()).getTime(), 100);
    await createTransaction(app, jwtToken, 't1', (new Date()).getTime(), 100);

    const latestTransactionsQuery = gql`
      query {
        latestTransactions {
          date totalAmount 
          transactions {
            amount
          }
        }
      }
    `;

    const { data } = await request<{ latestTransactions: LatestTransactionsByDay[] }>(app.getHttpServer())
      .query(latestTransactionsQuery)
      .set(...getAuthHeader(jwtToken))
      .expectNoErrors();

    expect(data?.latestTransactions).toHaveLength(2);
  });
});
