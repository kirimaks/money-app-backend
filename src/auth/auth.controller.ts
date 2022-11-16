import { UsePipes, Controller, Get, Post, Body, HttpCode } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignUpDTO, SignInBody, signInBodySchema, signUpBodySchema } from './auth.validation';
import { YupPipe } from '../pipes/yup.pipe';
import { PrismaClientService } from '../prisma-client/prisma-client.service';


@Controller('auth')
export class AuthController {
    private readonly authService: AuthService;

    constructor(authService:AuthService) {
        this.authService = authService;
    }

    @Post('sign-up')
    @UsePipes(new YupPipe(signInBodySchema))
    signUp(@Body() signUpDTO: SignUpDTO) {
        this.authService.createUser(signUpDTO);
        return {status: 'ok'};
    }

    @Post('sign-in')
    @HttpCode(200)
    @UsePipes(new YupPipe(signUpBodySchema))
    signIn(@Body() signInBody: SignInBody) {
        this.authService.login(signInBody);
        return {status: 'ok'};
    }
}
