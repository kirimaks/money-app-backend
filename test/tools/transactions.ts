import gql from 'graphql-tag';
import request from 'supertest-graphql';
import { getAuthHeader } from './auth';

import type { INestApplication } from '@nestjs/common';
import type { TransactionRepresentation } from '../../src/transaction/transaction.types';

export function getTransactionAmount() {
  return parseFloat((Math.random() * 100).toFixed(2));
}

export function getTransactionTime() {
  return new Date().getTime();
}

export async function createTransaction(
  app: INestApplication,
  jwtToken: string,
  name: string,
  timestamp: number,
  amount: number,
  tagIds: string[] = [],
): Promise<TransactionRepresentation> {
  const newTransactionQuery = gql`
    mutation {
      createTransaction( 
        name: "${name}" amount: ${amount} timestamp: "${timestamp}"
        tagIds: ${JSON.stringify(tagIds)}
      ) {
        id name timestamp tagIds
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
