import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import dayjs from '../src/tools/dayjs';

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

  test('Latest transactions 1 day test', async () => {
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();

    await signUpTool(app, testEmail, testPassword);
    const jwtToken = await signInTool(app, testEmail, testPassword);

    const testTime = dayjs('2000-05-01').utc();
    const endTime = testTime;
    const startTime = testTime.subtract(1, 'month');

    await createTransaction(app, jwtToken, 't1', endTime.subtract(3, 'hour').format(), 100);
    await createTransaction(app, jwtToken, 't2', endTime.subtract(2, 'hour').format(), 200);
    await createTransaction(app, jwtToken, 't3', endTime.subtract(1, 'hour').format(), 300);

    const latestTransactionsQuery = gql`
      query {
        latestTransactions(timeRangeStart: "${startTime.format()}" timeRangeEnd: "${endTime.format()}") {
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

  test('Latest transactions many days test', async () => {
    const testEmail = getRandomEmail();
    const testPassword = getRandomPassword();
    await signUpTool(app, testEmail, testPassword);
    const jwtToken = await signInTool(app, testEmail, testPassword);

    const twoDaysAgo = dayjs('2000-01-05').utc().subtract(2, 'days').format();
    const oneDayAgo = dayjs('2000-01-05').utc().subtract(1, 'days').format();
    const today = dayjs('2000-01-05').utc().format();

    await createTransaction(app, jwtToken, '2daysAgo1', twoDaysAgo, 100);
    await createTransaction(app, jwtToken, '2daysAgo2', twoDaysAgo, 150);
    await createTransaction(app, jwtToken, '2daysAgo3', twoDaysAgo, 200);

    await createTransaction(app, jwtToken, '1dayAgo1', oneDayAgo, 500);
    await createTransaction(app, jwtToken, '1dayAgo2', oneDayAgo, 300);

    await createTransaction(app, jwtToken, 'today1', today, 100);
    await createTransaction(app, jwtToken, 'today2', today, 50);

    const latestTransactionsQuery = gql`
      query {
        latestTransactions(timeRangeStart: "${oneDayAgo}" timeRangeEnd: "${today}") {
          date totalAmount 
            transactions {
              datetime, amount
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

    test('Latest transactions pagination', async () => {
      const testEmail = getRandomEmail();
      const testPassword = getRandomPassword();
      await signUpTool(app, testEmail, testPassword);
      const jwtToken = await signInTool(app, testEmail, testPassword);

      const testDate = '2020-01-20';
      const threeDaysAgo = dayjs(testDate).utc().subtract(3, 'days').format();
      const twoDaysAgo = dayjs(testDate).utc().subtract(2, 'days').format();
      const oneDayAgo = dayjs(testDate).utc().subtract(1, 'days').format();
      const today = dayjs(testDate).utc().format();

      await createTransaction(app, jwtToken, '3daysAgo1', threeDaysAgo, 100);
      await createTransaction(app, jwtToken, '3daysAgo2', threeDaysAgo, 200);
      await createTransaction(app, jwtToken, '3daysAgo3', threeDaysAgo, 300);

      await createTransaction(app, jwtToken, '2daysAgo1', twoDaysAgo, 500);
      await createTransaction(app, jwtToken, '2daysAgo2', twoDaysAgo, 600);

      await createTransaction(app, jwtToken, '1dayAgo1', oneDayAgo, 50);
      await createTransaction(app, jwtToken, '1dayAgo2', oneDayAgo, 150);
      await createTransaction(app, jwtToken, '1dayAgo3', oneDayAgo, 300);

      await createTransaction(app, jwtToken, 'today1', today, 300);
      await createTransaction(app, jwtToken, 'today2', today, 500);

      const latestTransactionsQuery = gql`
        query {
          latestTransactions(timeRangeStart: "${threeDaysAgo}" timeRangeEnd: "${today}") {
            date totalAmount
            transactions {
              datetime amount
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
      expect(data?.latestTransactions[0]?.totalAmount).toEqual(800);

      expect(data?.latestTransactions[1]?.transactions).toHaveLength(3);
      expect(data?.latestTransactions[1]?.totalAmount).toEqual(500);

      const latestTransactionsSecondPageQuery = gql`
        query {
          latestTransactions(timeRangeStart: "${threeDaysAgo}" timeRangeEnd: "${twoDaysAgo}") {
            date totalAmount
            transactions {
              datetime amount
            }
          }
        }
      `;

      const secondPageResp = await request<{ latestTransactions: LatestTransactionsByDay[] }>(app.getHttpServer())
        .query(latestTransactionsSecondPageQuery)
        .set(...getAuthHeader(jwtToken))
        .expectNoErrors();

      expect(secondPageResp.data?.latestTransactions).toHaveLength(2);

      expect(secondPageResp.data?.latestTransactions[0]?.transactions).toHaveLength(2);
      expect(secondPageResp.data?.latestTransactions[0]?.totalAmount).toEqual(1100);

      expect(secondPageResp.data?.latestTransactions[1]?.transactions).toHaveLength(3);
      expect(secondPageResp.data?.latestTransactions[1]?.totalAmount).toEqual(600);
    });
});
