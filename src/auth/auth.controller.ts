import { 
    UsePipes, Controller, Get, Post, Body, HttpCode, Logger, UseGuards,
    BadRequestException, InternalServerErrorException, UnauthorizedException 
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDTO, SignInBody, signInBodySchema, signUpBodySchema } from './auth.validation';
import { YupPipe } from '../pipes/yup.pipe';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { 
    EMAIL_EXISTS_ERROR, INTERNAL_SERVER_ERROR, SIGN_IN_EMAIL_ERROR, SIGN_IN_PASSWORD_ERROR,
    SIGN_UP_OK_MESSAGE, SIGN_IN_OK_MESSAGE
} from './auth.constants';
import { EmailExistsError, PasswordAuthError, EmailAuthError } from './auth.errors';
import { JwtAuthGuard } from './auth.jwt.guard';


@Controller('auth')
export class AuthController { 
    private readonly authService: AuthService;
    private readonly logger: Logger;

    constructor(authService:AuthService, logger:Logger) {
        this.authService = authService;
        this.logger = logger;
    }

    @Post('sign-up')
    @UsePipes(new YupPipe(signInBodySchema))
    async signUp(@Body() signUpDTO: SignUpDTO) {
        try {
            await this.authService.createUser(signUpDTO);
            return { message: SIGN_UP_OK_MESSAGE };

        } catch(error) {
            if (error instanceof EmailExistsError) {
                throw new BadRequestException(EMAIL_EXISTS_ERROR);
            }
        }

        throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }

    @Post('sign-in')
    @HttpCode(200)
    @UsePipes(new YupPipe(signUpBodySchema))
    async signIn(@Body() signInBody: SignInBody) {
        try {
            const jwtToken = await this.authService.login(signInBody);
            return { 
                message: SIGN_IN_OK_MESSAGE,
                jwt_token: jwtToken,
            };
        } catch(error) {
            if (error instanceof PasswordAuthError) {
                throw new UnauthorizedException(SIGN_IN_PASSWORD_ERROR);
            }

            if (error instanceof EmailAuthError) {
                throw new UnauthorizedException(SIGN_IN_EMAIL_ERROR);
            }
        }

        throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }

    @Get('test-jwt')
    @UseGuards(JwtAuthGuard)
    profile() {
        return { message: 'Profile page' };
    }
}
