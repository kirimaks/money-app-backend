import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';

import { AuthModule } from '../src/auth/auth.module';
import {
  SIGN_UP_URL,
  SIGN_IN_URL,
  EMAIL_EXISTS_ERROR,
  SIGN_UP_OK_MESSAGE,
  SIGN_IN_OK_MESSAGE,
  SIGN_IN_PASSWORD_ERROR,
  SIGN_IN_EMAIL_ERROR,
} from '../src/auth/auth.constants';
import { getRandomEmail, getRandomPassword } from './tools/auth';

describe('Auth test', () => {
  let app: INestApplication;
  const testEmail = getRandomEmail();
  const testPassword = getRandomPassword();
  let jwtToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Sign up', () => {
    test(`POST ${SIGN_UP_URL}`, () => {
      return request(app.getHttpServer())
        .post(SIGN_UP_URL)
        .send({
          email: testEmail,
          password: testPassword,
          confirm: testPassword,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.CREATED);
          expect(response.body.message).toEqual(SIGN_UP_OK_MESSAGE);
        });
    });
  });

  describe('Email exists', () => {
    test(`POST ${SIGN_UP_URL}`, () => {
      return request(app.getHttpServer())
        .post(`${SIGN_UP_URL}`)
        .send({
          email: testEmail,
          password: testPassword,
          confirm: testPassword,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
          expect(response.body.message).toEqual(EMAIL_EXISTS_ERROR);
        });
    });
  });

  describe('Sign in fail (wrong password)', () => {
    test(`POST ${SIGN_IN_URL}`, () => {
      return request(app.getHttpServer())
        .post(SIGN_IN_URL)
        .send({
          email: testEmail,
          password: getRandomPassword(),
        })
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toEqual(SIGN_IN_PASSWORD_ERROR);
        });
    });
  });

  describe('Sign in fail (wrong email)', () => {
    test(`POST ${SIGN_IN_URL}`, () => {
      return request(app.getHttpServer())
        .post(SIGN_IN_URL)
        .send({
          email: getRandomEmail(),
          password: getRandomPassword(),
        })
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(response.body.message).toEqual(SIGN_IN_EMAIL_ERROR);
        });
    });
  });

  describe('Sign in ok ', () => {
    test(`POST ${SIGN_IN_URL}`, () => {
      return request(app.getHttpServer())
        .post(SIGN_IN_URL)
        .send({
          email: testEmail,
          password: testPassword,
        })
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.OK);
          expect(response.body.message).toEqual(SIGN_IN_OK_MESSAGE);
          expect(response.body.jwt_token).toBeTruthy();

          jwtToken = response.body.jwt_token;
        });
    });
  });

  describe('JWT Auth (wrong token)', () => {
    test('GET /auth/test-jwt', () => {
      return request(app.getHttpServer())
        .get('/auth/test-jwt')
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
        });
    });
  });

  describe('JWT Auth (correct toeken)', () => {
    test('GET /auth/test-jwt', () => {
      return request(app.getHttpServer())
        .get('/auth/test-jwt')
        .set('Authorization', `Bearer ${jwtToken}`)
        .then((response) => {
          expect(response.statusCode).toEqual(HttpStatus.OK);
        });
    });
  });
});
