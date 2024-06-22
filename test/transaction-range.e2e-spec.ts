import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import dayjs from '../src/tools/dayjs';

import {
  getRandomEmail,
  getRandomPassword,
  signUpTool,
  signInTool,
} from './tools/auth';
import { AuthModule } from '../src/auth/auth.module';
import { GraphqlModule } from '../src/graphql/graphql.module';
import { createTransaction } from './tools/transactions';
import { TransactionModule } from '../src/transaction/transaction.module';
import { getAuthHeader } from './tools/auth';

import type { TransactionsRange } from '../src/transaction/transaction.types';

describe('Transactions range test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, GraphqlModule, TransactionModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test('Transactions range 1 day test', async () => {
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();

    await signUpTool(app, testEmail, testPassword);
    const jwtToken = await signInTool(app, testEmail, testPassword);

    const testTime = dayjs('2000-05-01').utc();
    const endTime = testTime;
    const startTime = testTime.subtract(1, 'month');

    await createTransaction(
      app,
      jwtToken,
      't1',
      endTime.subtract(3, 'hour').format(),
      100,
    );
    await createTransaction(
      app,
      jwtToken,
      't2',
      endTime.subtract(2, 'hour').format(),
      200,
    );
    await createTransaction(
      app,
      jwtToken,
      't3',
      endTime.subtract(1, 'hour').format(),
      300,
    );

    const latestTransactionsQuery = gql`
      query {
        transactionsByRange(timeRangeStart: "${startTime.format()}" timeRangeEnd: "${endTime.format()}") {
          id name amount datetime
          tags {
            id name
          }
        }
      }
    `;

    const { data } = await request<{
      transactionsByRange: TransactionsRange[];
    }>(app.getHttpServer())
      .query(latestTransactionsQuery)
      .set(...getAuthHeader(jwtToken))
      .expectNoErrors();

    console.log(data);

    expect(data?.transactionsByRange).toHaveLength(3);
  });

});
