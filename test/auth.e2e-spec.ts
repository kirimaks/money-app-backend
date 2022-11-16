import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';


describe('Test SignIn', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('POST /auth/sign-in', () => {
        return request(
            app.getHttpServer()

        ).post('/auth/sign-in').send({
            email: 'test@test.test', 
            password: 'sometestpassword'

        }).expect(201);
    });
});

describe('Test SignUp', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('POST /auth/sing-up', () => {
        return request(
            app.getHttpServer()

        ).post('/auth/sign-up').send({
            email: 'test@test.test', 
            password: 'sometestpassword'

        }).expect(201);
    });
});
