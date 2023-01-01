import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { getAuthHeader } from './auth';
import dayjs from '../../src/tools/dayjs';

import type { INestApplication } from '@nestjs/common';
import type { TransactionRepresentation } from '../../src/transaction/transaction.types';

export function getTransactionAmount() {
  return parseFloat((Math.random() * 100).toFixed(2));
}

export function getTransactionTime():string {
  return dayjs.utc().format();
}

export async function createTransaction(
  app: INestApplication,
  jwtToken: string,
  name: string,
  datetime: string,
  amount: number,
  tagIds: string[] = [],
): Promise<TransactionRepresentation> {
  const newTransactionQuery = gql`
    mutation {
      createTransaction( 
        name: "${name}" amount: ${amount} datetime: "${datetime}"
        tagIds: ${JSON.stringify(tagIds)}
      ) {
        id name datetime tagIds
      }
    }
  `;

  const httpServer = app.getHttpServer();
  const { data, errors } = await request<{
    createTransaction: TransactionRepresentation;
  }>(httpServer)
    .query(newTransactionQuery)
    .set(...getAuthHeader(jwtToken))
    .expectNoErrors();

  if (data) {
    return data.createTransaction;
  }

  throw new Error(`Transaction is not created: ${JSON.stringify(errors)}`);
}
