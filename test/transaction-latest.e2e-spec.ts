import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import dayjs from 'dayjs';

import { getRandomEmail, getRandomPassword, signUpTool, signInTool, } from './tools/auth';
import { AuthModule } from '../src/auth/auth.module'; import { GraphqlModule } from '../src/graphql/graphql.module';
import { createTransaction } from './tools/transactions';
import { TransactionModule } from '../src/transaction/transaction.module';
import { getAuthHeader } from './tools/auth';

import type { LatestTransactionsByDay } from '../src/transaction/transaction.types';


describe('Latest transactions test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, GraphqlModule, TransactionModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('Latest transactions', async () => {
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();
    await signUpTool(app, testEmail, testPassword);
    const jwtToken = await signInTool(app, testEmail, testPassword);

    await createTransaction(app, jwtToken, 't1', (new Date()).getTime(), 100);
    await createTransaction(app, jwtToken, 't2', (new Date()).getTime(), 200);
    await createTransaction(app, jwtToken, 't3', (new Date()).getTime(), 300);

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

    expect(data?.latestTransactions).toHaveLength(1);
    expect(data?.latestTransactions[0]?.transactions).toHaveLength(3);
    expect(data?.latestTransactions[0]?.totalAmount).toEqual(600);
  });

  test('Latest transactions multiple pages', async () => {
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();
    await signUpTool(app, testEmail, testPassword);
    const jwtToken = await signInTool(app, testEmail, testPassword);

    const twoDaysAgo = dayjs().subtract(2, 'days').toDate().getTime();
    const oneDayAgo = dayjs().subtract(1, 'days').toDate().getTime();
    const today = dayjs().toDate().getTime();

    await createTransaction(app, jwtToken, '2daysAgo1', twoDaysAgo, 100);
    await createTransaction(app, jwtToken, '2daysAgo2', twoDaysAgo, 150);
    await createTransaction(app, jwtToken, '2daysAgo3', twoDaysAgo, 200);

    await createTransaction(app, jwtToken, '1dayAgo1', oneDayAgo, 500);
    await createTransaction(app, jwtToken, '1dayAgo2', oneDayAgo, 300);

    await createTransaction(app, jwtToken, 'today1', today, 100);
    await createTransaction(app, jwtToken, 'today2', today, 50);

    const latestTransactionsQuery = gql`
      query {
        latestTransactions {
          date totalAmount 
          transactions {
            timestamp, amount
          }
        }
      }
    `;

    const { data } = await request<{ latestTransactions: LatestTransactionsByDay[] }>(app.getHttpServer())
      .query(latestTransactionsQuery)
      .set(...getAuthHeader(jwtToken))
      .expectNoErrors();

    expect(data?.latestTransactions).toHaveLength(2);

    expect(data?.latestTransactions[0]?.transactions).toHaveLength(2);
    expect(data?.latestTransactions[0]?.totalAmount).toEqual(150);

    expect(data?.latestTransactions[1]?.transactions).toHaveLength(2);
    expect(data?.latestTransactions[1]?.totalAmount).toEqual(800);
  });
});
