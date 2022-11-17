import crypto from 'crypto';

import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';


function getRandomEmail() {
    return [
        crypto.randomBytes(8).toString('hex'),
        '@',
        crypto.randomBytes(8).toString('hex'),
        '.com'
    ].join('');
}

function getRandomPassword() {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
}


describe('Auth test', () => {
    let app: INestApplication;
    const randomEmail = getRandomEmail();
    const randomPassword = getRandomPassword();

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    describe('Sign up', () => {
        test('POST /auth/sign-up', () => {
            return request(
                app.getHttpServer()

            ).post('/auth/sign-up').send({
                email: randomEmail,
                password: randomPassword,

            }).expect(201);
        });
    });

    describe('Sign in fail', () => {
        test('POST /auth/sign-in', () => {
            return request(
                app.getHttpServer()

            ).post('/auth/sign-in').send({
                email: getRandomEmail(),
                password: getRandomEmail()

            }).expect(401);
        });
    });

    describe('Sign in ok ', () => {
        test('POST /auth/sign-in', () => {
            return request(
                app.getHttpServer()

            ).post('/auth/sign-in').send({
                email: randomEmail,
                password: randomPassword

            }).expect(200);
        });
    });
});
