import { UsePipes, Controller, Get, Post, Body } from '@nestjs/common';

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

    @Get()
    root() {
        return 'Auth root';
    }
    
    @Post('sign-up')
    @UsePipes(new YupPipe(signInBodySchema))
    signUp(@Body() signUpDTO: SignUpDTO) {
        this.authService.createUser(signUpDTO);
        return {status: 'ok'};
    }

    @Post('sign-in')
    @UsePipes(new YupPipe(signUpBodySchema))
    signIn(@Body() signInBody: SignInBody) {
        this.authService.login(signInBody);
        return {status: 'ok'};
    }
}
